// ARTIFACT_META: {"artifactId":"SRC_SNAPSHOT_1","packId":"2026-09-26T20:00:43Z","generatedAt":"2026-09-26T20:00:43Z","generator":"prompt--artifact--generate-snapshot.md"}
// ===== FILE: src/index.jsx =====
import React from "react";
import { createRoot } from "react-dom/client";
import MainView from "./components/main-view/main-view";
import "./index.scss";
import { AppProvider } from "./contexts/AppContext";

// Main component (will eventually use all the others)
const MyFlixApplication = () => {
  return (
    <AppProvider>
      <div className="body-container p-2">
        <MainView />
      </div>
    </AppProvider>
  );
};

// Finds the root of your app
const container = document.querySelector("#root");
const root = createRoot(container);

// Tells React to render your app in the root DOM element
root.render(<MyFlixApplication />);

// ===== FILE: src/components/main-view/main-view.jsx =====
import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";

const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState("");
  const { baseUrl } = useAppContext();

  useEffect(() => {
    if (!token) return;

    fetch(`${baseUrl}/movies`, {
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

// ===== FILE: src/components/login-view/login-view.jsx =====
import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";

// eslint-disable-next-line react/prop-types
export const LoginView = ({ onLoggedIn }) => {
  // State variables to manage the input values for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fail, setFail] = useState(false); // State to track login failure
  const { baseUrl } = useAppContext();

  // Handle form submission
  const handleLogin = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    // Data object to be sent to the server
    const data = {
      Username: username,
      Password: password,
    };

    try {
      // Send a POST request to the login endpoint
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        body: JSON.stringify(data), // Convert the data object to a JSON string
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
      });

      if (!response.ok) {
        setFail(true); // Set fail state to true if response is not OK
        return;
      }

      const result = await response.json(); // Convert the response to JSON
      console.log("Login response:", result); // Log the response data

      if (result.user) {
        // If login is successful, store the user and token in localStorage
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        onLoggedIn(result.user, result.token); // Call the onLoggedIn callback with the user and token
      } else {
        setFail(true); // Set fail state to true if user data is not present in the response
      }
    } catch (e) {
      console.error("Something went wrong:", e); // Log error in the console
      alert("Something went wrong: " + e); // Alert if there is an error during the request
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Center the login form vertically and horizontally */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Container for the form with background, padding, rounded corners, and shadow */}
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {/* Form title */}
        <form onSubmit={handleLogin}>
          {/* Form element with an onSubmit handler */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="username">
              Username:
            </label>
            {/* Username input field */}
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update the username state on change
              required
              minLength="3"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password:
            </label>
            {/* Password input field */}
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update the password state on change
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              autoComplete="current-password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              id="button"
              type="submit"
              className=" text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
            {/* Submit button */}
          </div>
        </form>

        {/* Container for the alert message */}
        <div className="mt-4 w-full max-w-md">
          {/* Display failure message if fail state is true */}
          {fail && (
            <div
              className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">
                Login unsuccessful. Please try again.
              </span>
              <span
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => refresh()}
              >
                <svg
                  className="fill-current h-6 w-6 text-yellow-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 5.652a1 1 0 0 1 1.414 0l.354.354a1 1 0 0 1 0 1.414L11.414 12l4.702 4.707a1 1 0 0 1 0 1.414l-.354.354a1 1 0 0 1-1.414 0L10 14.414 5.297 19.121a1 1 0 0 1-1.414 0l-.354-.354a1 1 0 0 1 0-1.414L8.586 12 3.884 7.293a1 1 0 0 1 0-1.414l.354-.354a1 1 0 0 1 1.414 0L10 9.586l4.707-4.707a1 1 0 0 1 1.414 0l.354.354a1 1 0 0 1 0 1.414L11.414 12l4.702 4.707a1 1 0 0 1 0 1.414l-.354.354a1 1 0 0 1-1.414 0L10 14.414 5.297 19.121a1 1 0 0 1-1.414 0l-.354-.354a1 1 0 0 1 0-1.414L8.586 12 3.884 7.293a1 1 0 0 1 0-1.414l.354-.354a1 1 0 0 1 1.414 0L10 9.586z" />
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===== FILE: src/components/signup-view/signup-view.jsx =====
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";

// Component for the signup form
export const SignupView = () => {
  // State variables for form fields and success/failure messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const { baseUrl } = useAppContext();

  // Function to refresh the page
  const refresh = () => window.location.reload(true);

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    // Function to check if passwords match
    function checkPasswordConfirmation(password, confirmPassword) {
      return password === confirmPassword;
    }

    // Check if passwords match
    if (!checkPasswordConfirmation(password, confirmPassword)) {
      alert("The passwords do not match. Please try again."); // Show error message if passwords don't match
      window.location.reload(); // Reload the page
      return;
    }

    // Data to be sent in the request
    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    // Send POST request to the server
    fetch(`${baseUrl}/users`, {
      method: "POST",
      body: JSON.stringify(data), // Convert data to JSON string
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
    }).then((response) => {
      if (response.ok) {
        setSuccess(true); // Set success state to true if response is OK
      } else {
        setFail(true); // Set fail state to true if response is not OK
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Container for centering the form vertically and horizontally */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        {/* Form element */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="username">
            Username:
          </label>
          {/* Username input field */}
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state on change
            required
            minLength="5"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="password">
            Password:
          </label>
          {/* Password input field */}
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state on change
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password:
          </label>
          {/* Confirm password input field */}
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state on change
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label>
          {/* Email input field */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state on change
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="birthday">
            Birthday:
          </label>
          {/* Birthday input field */}
          <input
            type="date"
            id="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)} // Update birthday state on change
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          id="button"
          type="submit"
          className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
        {/* Submit button */}
      </form>

      <div className="mt-4 w-full max-w-md">
        {/* Display success message if success state is true */}
        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <p>Sign up successful. Account created.</p>
            <Link to={"/login"}>
              <button
                id="button"
                className=" text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
              >
                Login
              </button>
              {/* Link to login page with a button */}
            </Link>
          </div>
        )}
        {/* Display failure message if fail state is true */}
        {fail && (
          <div
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">
              Login unsuccessful. Please try again.
            </span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => refresh()}
            >
              <svg
                className="fill-current h-6 w-6 text-yellow-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 5.652a1 1 0 0 1 1.414 0l.354.354a1 1 0 0 1 0 1.414L11.414 12l4.702 4.707a1 1 0 0 1 0 1.414l-.354.354a1 1 0 0 1-1.414 0L10 14.414 5.297 19.121a1 1 0 0 1-1.414 0l-.354-.354a1 1 0 0 1 0-1.414L8.586 12 3.884 7.293a1 1 0 0 1 0-1.414l.354-.354a1 1 0 0 1 1.414 0L10 9.586l4.707-4.707a1 1 0 0 1 1.414 0l.354.354a1 1 0 0 1 0 1.414L11.414 12l4.702 4.707a1 1 0 0 1 0 1.414l-.354.354a1 1 0 0 1-1.414 0L10 14.414 5.297 19.121a1 1 0 0 1-1.414 0l-.354-.354a1 1 0 0 1 0-1.414L8.586 12 3.884 7.293a1 1 0 0 1 0-1.414l.354-.354a1 1 0 0 1 1.414 0L10 9.586z" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== FILE: src/components/movie-card/movie-card.jsx =====
/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie }) => {
  return (
    <div
      id="card"
      className="flex flex-col h-full bg-white shadow-md rounded-lg overflow-hidden"
    >
      <img
        className="w-full h-64 object-contain"
        src={movie.image}
        alt={movie.title}
      />
      <div className="flex flex-col justify-between flex-grow p-4">
        <div>
          <h2 className="text-lg font-bold mb-2">{movie.title}</h2>
          <p className="mb-2">{movie.description}</p>
          <p className="mb-2">Genre: {movie.genre}</p>
          <p className="mb-2">Director: {movie.director}</p>
        </div>
        <div className="text-center mt-4">
          <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
            <button id="button" className="px-4 py-2 font-bold rounded">
              Open
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired,
    director: PropTypes.string.isRequired,
  }).isRequired,
};

// ===== FILE: src/components/movie-view/movie-view.jsx =====
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";

export const MovieView = ({ movies, user, setUser, token }) => {
  const { movieId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  // Base URL
  const { baseUrl } = useAppContext();

  useEffect(() => {
    const isFavorited = user.FavoriteMovies.includes(movieId);
    setIsFavorite(isFavorited);
  }, []);

  const removeFavorite = () => {
    fetch(`${baseUrl}/users/${user.Username}/movies/${movieId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          setIsFavorite(false);
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        }
      });
  };

  const addToFavorite = () => {
    fetch(`${baseUrl}/users/${user.Username}/movies/${movieId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          setIsFavorite(true);
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        }
      });
  };

  const movie = movies.find((m) => m.id === movieId);

  return (
    <div className="flex items-center justify-center min-h-screen py-4">
      <div className="flex flex-col lg:flex-row w-11/12 lg:w-4/5 bg-white shadow-md rounded-lg overflow-hidden">
        {/* Left side image */}
        <img
          className="w-full lg:w-1/2 object-cover"
          src={movie.image}
          alt={movie.title}
        />
        {/* Right side content */}
        <div className="flex flex-col justify-between w-full lg:w-1/2 p-6">
          <div>
            <div className="font-bold text-xl lg:text-2xl mb-2">
              {movie.title}
            </div>
            <div className="mb-4">
              <p className="text-base lg:text-lg">{movie.description}</p>
            </div>
            <div className="mb-4">
              <p className="text-base lg:text-lg">Genre: {movie.genre}</p>
              <p className="text-base lg:text-lg">Director: {movie.director}</p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            {isFavorite ? (
              <button
                className="px-4 py-2 font-bold rounded text-sm lg:text-base"
                onClick={removeFavorite}
              >
                Remove from favorites
              </button>
            ) : (
              <button
                className="px-4 py-2 font-bold rounded text-sm lg:text-base"
                onClick={addToFavorite}
              >
                Add to favorites
              </button>
            )}
            <Link to={`/`} className="inline-block">
              <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded text-sm lg:text-base">
                Back
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== FILE: src/components/navigation-bar/navigation-bar.jsx =====
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav>
      <div className="max-w-7xl mx-auto px-2">
        <div className="relative flex items-center justify-between h-16">
          {/* Left-aligned logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="text-xl font-bold">
              <h1 className="text-4xl text-red-400">MyFlix</h1>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:text-gray-900"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen ? "true" : "false"}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>

              {/* Hamburger icon */}
              <svg
                className={`h-6 w-6 ${isMenuOpen ? "hidden" : "block"}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>

              {/* Close icon */}
              <svg
                className={`h-6 w-6 ${isMenuOpen ? "block" : "hidden"}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Right-aligned navigation links */}
          <div className="hidden sm:flex sm:items-center sm:justify-end sm:space-x-4">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium"
                  id="navlink"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-md text-sm font-medium"
                  id="navlink"
                >
                  Signup
                </Link>
              </>
            )}
            {user && (
              <>
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-sm font-medium"
                  id="navlink"
                >
                  Home
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md text-sm font-medium"
                  id="navlink"
                >
                  My Profile
                </Link>
                <a
                  onClick={onLoggedOut}
                  className="px-3 py-2 rounded-md text-sm font-medium"
                  id="navlink"
                >
                  Logout
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Mobile menu, toggle with Tailwind's responsive utilities */}
      <div
        className={`${isMenuOpen ? "block" : "hidden"} sm:hidden bg-gray-100`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {!user && (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium"
                id="navlink"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium"
                id="navlink"
              >
                Signup
              </Link>
            </>
          )}
          {user && (
            <>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium"
                id="navlink"
              >
                Home
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium"
                id="navlink"
              >
                My Profile
              </Link>
              <button
                onClick={onLoggedOut}
                className="block px-3 py-2 rounded-md text-base font-medium"
                id="navlink"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// ===== FILE: src/components/profile-view/favorite-movies.jsx =====
import React from "react";
import { Link } from "react-router-dom";

function FavoriteMovies({ favoriteMovies }) {
  return (
    <>
      <h4 className="text-lg font-bold mb-4">Your Favorite Movies:</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoriteMovies.map((movie) => (
          <div key={movie.id} className="fav-movie">
            <Link to={`/movies/${movie.id}`}>
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full rounded-lg shadow-md hover:shadow-lg transition duration-300"
              />
              <h1 className="text-center mt-2">{movie.title}</h1>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default FavoriteMovies;

// ===== FILE: src/components/profile-view/profile-view.jsx =====
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import UserInfo from "./user-info";
import FavoriteMovies from "./favorite-movies";
import UpdateUser from "./update-user";
import { useAppContext } from "../../contexts/AppContext";

export const ProfileView = ({ user, token, setUser, movies }) => {
  // Form states
  const [username, setUsername] = useState(user.Username);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user.Email);
  const [birthday, setBirthday] = useState("user.BirthDate");
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  // Base URL
  const { baseUrl } = useAppContext();

  const favoriteMovies = movies.filter((movie) =>
    user.FavoriteMovies.includes(movie.id)
  );

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      BirthDate: birthday,
    };

    fetch(`${baseUrl}/users/${user.Username}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setFail(true);
        }
      })
      .then((data) => {
        if (data) {
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
          setSuccess(true);
          resetFormFields();
        }
      });
  };

  const resetFormFields = () => {
    setUsername(user.Username);
    setPassword("");
    setEmail(user.Email);
    setBirthday("");
  };

  const handleDeleteUser = () => {
    fetch(`${baseUrl}/users/${user.Username}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.ok) {
        setUser(null);
        localStorage.clear();
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="user-containers">
          <div className="bg-white shadow-md rounded-lg p-4">
            <UserInfo name={user.Username} email={user.Email} />
          </div>
        </div>
        <div className="user-containers">
          <div className="bg-white shadow-md rounded-lg p-4">
            <UpdateUser
              handleSubmit={handleSubmit}
              setUsername={setUsername}
              setPassword={setPassword}
              setEmail={setEmail}
              setBirthday={setBirthday}
              username={username}
              password={password}
              email={email}
              birthday={birthday}
            />
          </div>
          <div>
            {success && (
              <div className="mt-4">
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">Update successful.</span>
                  <span
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={() => {
                      setSuccess(false);
                      resetFormFields();
                    }}
                  >
                    <svg
                      className="fill-current h-6 w-6 text-green-500"
                      role="button"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <title>Close</title>
                      <path d="M14.348 5.652a1 1 0 0 1 1.414 0l.354.354a1 1 0 0 1 0 1.414L11.414 12l4.702 4.707a1 1 0 0 1 0 1.414l-.354.354a1 1 0 0 1-1.414 0L10 14.414 5.297 19.121a1 1 0 0 1-1.414 0l-.354-.354a1 1 0 0 1 0-1.414L8.586 12 3.884 7.293a1 1 0 0 1 0-1.414l.354-.354a1 1 0 0 1 1.414 0L10 9.586l4.707-4.707a1 1 0 0 1 1.414 0l.354.354a1 1 0 0 1 0 1.414L11.414 12l4.702 4.707a1 1 0 0 1 0 1.414l-.354.354a1 1 0 0 1-1.414 0L10 14.414 5.297 19.121a1 1 0 0 1-1.414 0l-.354-.354a1 1 0 0 1 0-1.414L8.586 12 3.884 7.293a1 1 0 0 1 0-1.414l.354-.354a1 1 0 0 1 1.414 0L10 9.586l4.707-4.707a1 1 0 0 1 1.414 0l.354.354a1 1 0 0 1 0 1.414L11.414 12l4.702 4.707a1 1 0 0 1 0 1.414l-.354.354a1 1 0 0 1-1.414 0L10 14.414 5.297 19.121a1 1 0 0 1-1.414 0l-.354-.354a1 1 0 0 1 0-1.414L8.586 12 3.884 7.293a1 1 0 0 1 0-1.414l.354-.354a1 1 0 0 1 1.414 0L10 9.586z" />
                    </svg>
                  </span>
                </div>
              </div>
            )}
            {fail && (
              <div className="mt-4">
                <div
                  className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">Update unsuccessful.</span>
                  <span
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={() => setFail(false)}
                  >
                    <svg
                      className="fill-current h-6 w-6 text-yellow-500"
                      role="button"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <title>Close</title>
                      <path d="M14.348 5.652a1 1 0 0 1 1.414 0l.354.354a1 1 0 0 1 0 1.414L11.414 12l4.702 4.707a1 1 0 0 1 0 1.414l-.354.354a1 1 0 0 1-1.414 0L10 14.414 5.297 19.121a1 1 0 0 1-1.414 0l-.354-.354a1 1 0 0 1 0-1.414L8.586 12 3.884 7.293a1 1 0 0 1 0-1.414l.354-.354a1 1 0 0 1 1.414 0L10 9.586l4.707-4.707a1 1 0 0 1 1.414 0l.354.354a1 1 0 0 1 0 1.414L11.414 12l4.702 4.707a1 1 0 0 1 0 1.414l-.354.354a1 1 0 0 1-1.414 0L10 14.414 5.297 19.121a1 1 0 0 1-1.414 0l-.354-.354a1 1 0 0 1 0-1.414L8.586 12 3.884 7.293a1 1 0 0 1 0-1.414l.354-.354a1 1 0 0 1 1.414 0L10 9.586z" />
                    </svg>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <FavoriteMovies favoriteMovies={favoriteMovies} />
      </div>

      <button
        id="button"
        className=" font-bold py-2 px-4 rounded"
        onClick={handleShowModal}
      >
        Delete account
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
          <div className="bg-white p-8 rounded-lg max-w-md w-full z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Delete account</h3>
            </div>
            <p className="mb-4">Are you sure?</p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleDeleteUser}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={handleCloseModal}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== FILE: src/components/profile-view/update-user.jsx =====
import React from "react";

function UpdateUser({
  handleSubmit,
  username,
  setUsername,
  password,
  setPassword,
  email,
  setEmail,
  birthday,
  setBirthday,
}) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Update Your Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium">
            Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            minLength="3"
            placeholder="Enter Username"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            minLength="3"
            placeholder="Enter Password"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            placeholder="Enter Email"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="birthday" className="block text-sm font-medium">
            Birthday:
          </label>
          <input
            id="birthday"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <button
          id="button"
          type="submit"
          className="font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}

export default UpdateUser;

// ===== FILE: src/components/profile-view/user-info.jsx =====
import React from "react";

function UserInfo({ email, name }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Your Details</h3>
      <p className="mb-1">Name: {name}</p>
      <p className="mb-1">Email: {email}</p>
    </div>
  );
}

export default UserInfo;

// ===== FILE: src/contexts/AppContext.js =====
import React, { createContext, useContext } from "react";

// Create a context with a default value (null in this case)
const AppContext = createContext(null);

// Custom hook to use the AppContext
export const useAppContext = () => {
  return useContext(AppContext);
};

// Create a provider component
export const AppProvider = ({ children }) => {
  // Define the baseUrl
  const baseUrl = "https://movie-api-mreb.onrender.com";

  return (
    <AppContext.Provider value={{ baseUrl }}>{children}</AppContext.Provider>
  );
};
