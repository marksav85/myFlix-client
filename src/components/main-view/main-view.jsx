import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={logout}
      />

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
                <ProfileView
                  user={user}
                  movies={movies}
                />
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
                <div className="p-4">Loading movies...</div>
              ) : movieError ? (
                <div className="p-4" role="alert">{movieError}</div>
              ) : (
                <MovieView
                  movies={movies}
                />
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
                <div className="flex items-center justify-center">
                  <div className="w-full sm:w-9/10 lg:w-4/5 mx-auto flex flex-col items-center justify-center">
                    <div id="searchbar" className="mt-1 mb-1 w-full">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    {isLoading ? (
                      <div className="w-full" role="status">Loading movies...</div>
                    ) : movieError ? (
                      <div className="w-full" role="alert">{movieError}</div>
                    ) : movies.length === 0 ? (
                      <div className="w-full">No movies are available.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
                        {movies
                          .filter((movie) =>
                            movie.title
                              .toLowerCase()
                              .includes(filter.toLowerCase())
                          )
                          .map((movie) => (
                            <div
                              key={movie.id}
                              className="bg-white shadow-md rounded-lg overflow-hidden"
                            >
                              <MovieCard movie={movie} />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default MainView;
