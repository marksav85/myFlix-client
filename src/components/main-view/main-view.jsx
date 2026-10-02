import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { api } from "../../api/client";
import { useAppContext } from "../../contexts/AppContext";

const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [movieError, setMovieError] = useState("");
  const { user, token, logout, handleApiError } = useAppContext();

  useEffect(() => {
    const controller = new AbortController();

    if (!token) {
      setMovies([]);
      setIsLoading(false);
      setMovieError("");
      return () => controller.abort();
    }

    setIsLoading(true);
    setMovieError("");

    api
      .getMovies(token, controller.signal)
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("The movie service returned an invalid response.");
        }

        const moviesFromApi = data.map((movie) => ({
          id: movie._id,
          title: movie.Title,
          description: movie.Description,
          genre: movie.Genre?.Name || "Unknown",
          director: movie.Director?.Name || "Unknown",
          image: movie.ImagePath,
        }));
        if (!controller.signal.aborted) {
          setMovies(moviesFromApi);
        }
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        if (!handleApiError(error)) {
          setMovieError("Movies could not be loaded. Please try again later.");
          setMovies([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [token, handleApiError]);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={logout}
      />

      <main id="main-content" tabIndex={-1} className="page-container py-6">
      <Routes>
        <Route
          path="/signup"
          element={<>{user ? <Navigate to="/" /> : <SignupView />}</>}
        />

        <Route
          path="/login"
          element={
            <>
              {user ? (
                <Navigate to="/" />
              ) : (
                <LoginView
                />
              )}
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <>
              {!user ? (
                <Navigate to="/login" replace />
              ) : (
                <ProfileView movies={movies} isLoadingMovies={isLoading} movieError={movieError} />
              )}
            </>
          }
        />

        <Route
          path="/movies/:movieId"
          element={
            <>
              {!user ? (
                <Navigate to="/login" replace />
              ) : isLoading ? (
                <p className="library-notice" role="status">Loading movies...</p>
              ) : movieError ? (
                <div className="library-notice" role="alert">
                  <p>{movieError}</p>
                  <Link to="/" className="button button-secondary mt-4">Back to Movies</Link>
                </div>
              ) : (
                <MovieView movies={movies} />
              )}
            </>
          }
        />

        <Route
          path="/"
          element={
            <>
              {!user ? (
                <Navigate to="/login" replace />
              ) : (
                <section aria-labelledby="movie-library-title">
                  <h1 id="movie-library-title" className="text-heading-lg-mobile sm:text-heading-lg">Movie Library</h1>
                  <div role="search" aria-label="Movie library" className="my-6 max-w-md">
                    <label htmlFor="movie-search" className="form-label">Search movies</label>
                    <input id="movie-search" type="search" placeholder="Search by title..."
                      value={filter} onChange={(event) => setFilter(event.target.value)}
                      className="form-input" />
                  </div>
                  {isLoading ? (
                    <p className="library-notice" role="status">Loading movies...</p>
                  ) : movieError ? (
                    <p className="library-notice" role="alert">{movieError}</p>
                  ) : movies.length === 0 ? (
                    <p className="library-notice" role="status">No movies are available.</p>
                  ) : filteredMovies.length === 0 ? (
                    <p className="library-notice" role="status">No movies match your search. Try another title.</p>
                  ) : (
                    <div className="movie-grid">
                      {filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
                    </div>
                  )}
                </section>
              )}
            </>
          }
        />
      </Routes>
      </main>
    </BrowserRouter>
  );
};

export default MainView;
