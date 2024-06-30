import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch("https://my-flix-films-d4434240379d.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const moviesFromApi = data.map((movie) => ({
          id: movie._id,
          title: movie.Title,
          description: movie.Description,
          genre: movie.Genre.Name,
          director: movie.Director.Name,
          image: movie.ImagePath,
        }));
        setMovies(moviesFromApi);
      });
  }, [token]);

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
          localStorage.clear();
        }}
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
                  onLoggedIn={(user, token) => {
                    setUser(user);
                    setToken(token);
                  }}
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
                  token={token}
                  setUser={setUser}
                  movies={movies}
                  onLoggedOut={() => {
                    setUser(null);
                    setToken(null);
                    localStorage.clear();
                  }}
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
              ) : movies.length === 0 ? (
                <div>The list is empty!</div>
              ) : (
                <MovieView
                  movies={movies}
                  user={user}
                  setUser={setUser}
                  token={token}
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
                    {movies.length === 0 ? (
                      <div className="w-full">This list is empty!</div>
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
