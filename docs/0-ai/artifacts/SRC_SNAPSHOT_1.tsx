// ARTIFACT_META: {"artifactId":"SRC_SNAPSHOT_1","packId":"2026-10-09T13:50:22Z","generatedAt":"2026-10-09T13:50:22Z","generator":"prompt--artifact--generate-snapshot.md"}

// ===== FILE: src/components/main-view/main-view.jsx =====
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

// ===== FILE: src/components/login-view/login-view.jsx =====
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { api } from "../../api/client";

export const LoginView = () => {
  // State variables to manage the input values for username and password
  const usernameInput = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, sessionNotice, clearSessionNotice } = useAppContext();

  // Handle form submission
  const handleLogin = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    // Data object to be sent to the server
    const data = {
      Username: username,
      Password: password,
    };

    setError("");
    setIsSubmitting(true);

    try {
      const result = await api.login(data);
      if (!result?.user || !result?.token) {
        throw new Error("The login response was incomplete.");
      }
      login(result.user, result.token);
    } catch {
      setError("Login unsuccessful. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-panel" aria-labelledby="login-title">
        <h1 id="login-title" className="mb-6 text-heading-lg-mobile sm:text-heading-lg">Login</h1>
        <form onSubmit={handleLogin} aria-busy={isSubmitting}
          aria-describedby={(error || sessionNotice) ? "login-feedback" : undefined} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="login-username">Username:</label>
            <input ref={usernameInput} id="login-username" name="username" type="text" value={username}
              onChange={(event) => setUsername(event.target.value)} required
              autoComplete="username" className="form-input" minLength="3" />
          </div>
          <div>
            <label className="form-label" htmlFor="login-password">Password:</label>
            <input id="login-password" name="password" type="password" value={password}
              onChange={(event) => setPassword(event.target.value)} required
              autoComplete="current-password" className="form-input" />
          </div>
          <button type="submit" disabled={isSubmitting} className="button button-primary w-full">
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
        {(error || sessionNotice) && (
          <div id="login-feedback" className="auth-notice mt-4" role="alert">
            <p className="min-w-0 flex-1">{error || sessionNotice}</p>
            <button type="button" aria-label="Dismiss message" className="button button-secondary shrink-0 px-3"
              onClick={() => {
                setError("");
                clearSessionNotice();
                usernameInput.current?.focus();
              }}>
              <svg aria-hidden="true" focusable="false" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 6l12 12M6 18L18 6" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
        <p className="mt-6 text-text-secondary">
          Need an account?{" "}
          <Link to="/signup" className="auth-link">Signup</Link>
        </p>
      </section>
    </div>
  );
};

// ===== FILE: src/components/movie-card/movie-card.jsx =====
import React, { useId } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useFavorite } from "../../hooks/useFavorite";

export const MovieCard = ({ movie, headingLevel = 2 }) => {
  const { isFavorite, isPending, error, toggleFavorite } = useFavorite(movie.id);
  const Heading = `h${headingLevel}`;
  const titleId = useId();
  const errorId = useId();

  return (
    <article className="movie-card" aria-labelledby={titleId}>
      <img className="aspect-[2/3] w-full object-cover" src={movie.image}
        alt={`${movie.title} poster`} loading="lazy" />
      <div className="flex flex-1 flex-col p-4">
        <Heading id={titleId} className="mb-3 line-clamp-2 min-h-[52px] break-words text-heading-sm">{movie.title}</Heading>
        <p className="mb-2 break-words text-body-sm text-text-secondary">Genre: {movie.genre}</p>
        <p className="mb-3 break-words text-body-sm text-text-secondary">Director: {movie.director}</p>
        <p className="mb-6 line-clamp-3 break-words text-body text-text-muted">{movie.description}</p>
        <div className="mt-auto flex flex-col gap-2">
          <Link to={`/movies/${encodeURIComponent(movie.id)}`} className="button button-secondary"
            aria-label={`View Details for ${movie.title}`}>View Details</Link>
          <button type="button" className="button button-primary" onClick={toggleFavorite}
            disabled={isPending} aria-busy={isPending} aria-pressed={isFavorite}
            aria-describedby={error ? errorId : undefined}
            aria-label={isPending ? `Updating... for ${movie.title}` : `${isFavorite ? "Remove from Favorites" : "Add to Favorites"}: ${movie.title}`}>
            {isPending ? "Updating..." : isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
          {error && <p id={errorId} role="alert" className="text-body-sm text-text-secondary">{error}</p>}
        </div>
      </div>
    </article>
  );
};

MovieCard.propTypes = {
  headingLevel: PropTypes.oneOf([2, 3]),
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired,
    director: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
};

// ===== FILE: src/components/movie-view/movie-view.jsx =====
import React, { useId } from "react";
import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import { useFavorite } from "../../hooks/useFavorite";

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();
  const { isFavorite, isPending, error, toggleFavorite } = useFavorite(movieId);
  const errorId = useId();
  const movie = movies.find((item) => item.id === movieId);

  if (!movie) {
    return (
      <section className="surface p-6 sm:p-8" aria-labelledby="movie-not-found-title">
        <h1 id="movie-not-found-title" className="mb-6 text-heading-lg-mobile sm:text-heading-lg">Movie not found.</h1>
        <Link to="/" className="button button-secondary">Back to Movies</Link>
      </section>
    );
  }

  return (
    <article className="movie-detail" aria-labelledby="movie-detail-title">
      <img className="movie-detail-poster" src={movie.image} alt={`${movie.title} poster`} />
      <div className="min-w-0 p-6 md:p-8 lg:p-10">
        <h1 id="movie-detail-title" className="mb-6 break-words text-heading-lg-mobile sm:text-heading-lg">{movie.title}</h1>
        <p className="mb-8 whitespace-pre-line break-words text-body-lg text-text-secondary">{movie.description}</p>
        <dl className="mb-8 space-y-4 text-body-lg">
          <div>
            <dt className="text-label text-text-muted">Genre</dt>
            <dd className="mt-1 break-words">{movie.genre}</dd>
          </div>
          <div>
            <dt className="text-label text-text-muted">Director</dt>
            <dd className="mt-1 break-words">{movie.director}</dd>
          </div>
        </dl>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" className="button button-primary" onClick={toggleFavorite}
            disabled={isPending} aria-busy={isPending} aria-pressed={isFavorite}
            aria-describedby={error ? errorId : undefined}>
            {isPending ? "Updating..." : isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
          <Link to="/" className="button button-secondary">Back to Movies</Link>
        </div>
        {error && <p id={errorId} role="alert" className="mt-4 text-body text-text-secondary">{error}</p>}
      </div>
    </article>
  );
};

MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      genre: PropTypes.string.isRequired,
      director: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ).isRequired,
};

// ===== FILE: src/components/navigation-bar/navigation-bar.jsx =====
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, NavLink, useLocation } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, user]);

  const closeMenu = () => setIsMenuOpen(false);
  const navigationItems = user
    ? [{ to: "/", label: "Home" }, { to: "/profile", label: "My Profile" }]
    : [{ to: "/login", label: "Login" }, { to: "/signup", label: "Signup" }];

  const renderLinks = () => (
    <>
      {navigationItems.map(({ to, label }) => (
        <NavLink key={to} to={to} end className="nav-link" onClick={closeMenu}>
          {label}
        </NavLink>
      ))}
      {user && (
        <button type="button" className="button button-secondary" onClick={() => {
          closeMenu();
          onLoggedOut();
        }}>
          Logout
        </button>
      )}
    </>
  );

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="border-b border-border-subtle bg-surface-1">
        <nav aria-label="Main navigation" className="page-container" onKeyDown={(event) => {
          if (event.key === "Escape" && isMenuOpen) {
            event.preventDefault();
            closeMenu();
            menuButton.current?.focus();
          }
        }}>
          <div className="flex min-h-[72px] items-center justify-between gap-4 py-3">
            <Link to="/" onClick={closeMenu} className="inline-flex min-h-[44px] items-center rounded-control text-2xl font-extrabold tracking-tight text-primary">
              myFlix
            </Link>
            <div className="hidden items-center gap-2 sm:flex">{renderLinks()}</div>
            <button ref={menuButton} type="button" className="button button-secondary sm:hidden"
              aria-controls="mobile-menu" aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
              onClick={() => setIsMenuOpen((open) => !open)}>
              <svg aria-hidden="true" focusable="false" className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
          <div id="mobile-menu" hidden={!isMenuOpen} className="border-t border-border-subtle pb-4 pt-3 sm:hidden">
            <div className="flex flex-col items-stretch gap-2">{renderLinks()}</div>
          </div>
        </nav>
      </header>
    </>
  );
};

NavigationBar.propTypes = {
  user: PropTypes.object,
  onLoggedOut: PropTypes.func.isRequired,
};

// ===== FILE: src/components/profile-view/favorite-movies.jsx =====
import React from "react";
import PropTypes from "prop-types";
import { MovieCard } from "../movie-card/movie-card";

function FavoriteMovies({ favoriteMovies, isLoading = false, error = "", hasFavoriteIds = false }) {
  return (
    <section aria-labelledby="favorite-movies-title">
      <h2 id="favorite-movies-title" className="mb-6 text-heading-md">Favorite Movies</h2>
      {isLoading ? <p className="library-notice" role="status">Loading favorite movies...</p>
        : error ? <p className="library-notice" role="alert">{error}</p>
        : favoriteMovies.length === 0 ? <p className="library-notice" role="status">{hasFavoriteIds
          ? "Your favorite movies are not available in the current catalog."
          : "You haven't added any favorite movies yet."}</p>
        : <div className="movie-grid">{favoriteMovies.map((movie) => <MovieCard key={movie.id} movie={movie} headingLevel={3} />)}</div>}
    </section>
  );
}

FavoriteMovies.propTypes = {
  favoriteMovies: PropTypes.array.isRequired, isLoading: PropTypes.bool,
  error: PropTypes.string, hasFavoriteIds: PropTypes.bool,
};
export default FavoriteMovies;

// ===== FILE: src/components/profile-view/profile-view.jsx =====
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import UserInfo from "./user-info";
import FavoriteMovies from "./favorite-movies";
import UpdateUser from "./update-user";
import { api } from "../../api/client";
import { useAppContext } from "../../contexts/AppContext";

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const emptyUser = {
  Username: "",
  Email: "",
  Birthday: "",
  FavoriteMovies: [],
};

export const ProfileView = ({ movies, isLoadingMovies = false, movieError = "" }) => {
  const { user, token, updateUser, logout, handleApiError } = useAppContext();
  const currentUser = user || emptyUser;
  const hasUser = Boolean(user);
  const [username, setUsername] = useState(currentUser.Username);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState(currentUser.Email || "");
  const [birthday, setBirthday] = useState(
    toDateInputValue(currentUser.Birthday || currentUser.BirthDate)
  );
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const savingPending = useRef(false);
  const deletionPending = useRef(false);
  const dialog = useRef(null);
  const cancelButton = useRef(null);
  const deleteTrigger = useRef(null);

  useEffect(() => {
    if (!showModal || !hasUser) return;
    const root = document.getElementById("root");
    const wasInert = root?.hasAttribute("inert");
    const previousOverflow = document.body.style.overflow;
    root?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(dialog.current?.querySelectorAll("button:not(:disabled)") || []);
    const focusInside = () => (focusable()[0] || dialog.current)?.focus();
    cancelButton.current?.focus();
    const containFocus = (event) => {
      if (!dialog.current?.contains(event.target)) focusInside();
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (!deletionPending.current) setShowModal(false);
      }
      if (event.key === "Tab") {
        const controls = focusable();
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first) { event.preventDefault(); dialog.current?.focus(); }
        else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog.current)) {
          event.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", containFocus);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", containFocus);
      if (!wasInert) root?.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
      if (deleteTrigger.current?.isConnected) deleteTrigger.current.focus();
    };
  }, [showModal, hasUser]);

  useEffect(() => {
    if (showModal && isDeleting) dialog.current?.focus();
  }, [showModal, isDeleting]);

  useEffect(() => {
    setUsername(currentUser.Username);
    setPassword("");
    setPasswordError("");
    setEmail(currentUser.Email || "");
    setBirthday(toDateInputValue(currentUser.Birthday || currentUser.BirthDate));
  }, [currentUser]);

  const favoriteMovies = useMemo(
    () => movies.filter((movie) => currentUser.FavoriteMovies?.includes(movie.id)),
    [movies, currentUser.FavoriteMovies]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (savingPending.current || deletionPending.current) return;
    setPasswordError("");
    if (!password || password.length < 5) {
      setSuccess("");
      setError("");
      setPasswordError(!password ? "Enter a password to save profile changes." : "Enter a password with at least 5 characters.");
      event.currentTarget.querySelector("#profile-password")?.focus();
      return;
    }
    savingPending.current = true;
    setSuccess("");
    setError("");
    setIsSaving(true);

    const updates = { Username: username, Email: email, Birthday: birthday, Password: password };

    try {
      const updatedUser = await api.updateUser(currentUser.Username, updates, token);
      if (updatedUser.Username !== currentUser.Username) {
        logout("Your username was changed. Please sign in again.");
        return;
      }
      updateUser(updatedUser);
      setSuccess("Update successful.");
    } catch (requestError) {
      if (!handleApiError(requestError)) {
        if (requestError.status === 422 && requestError.message === "Password is required") {
          setPasswordError("Enter a password to save profile changes.");
        } else {
          setError("Update unsuccessful. Please try again.");
        }
      }
    } finally {
      savingPending.current = false;
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (deletionPending.current || savingPending.current) return;
    deletionPending.current = true;
    setDeleteError("");
    setIsDeleting(true);
    try {
      await api.deleteUser(currentUser.Username, token);
      logout();
    } catch (requestError) {
      if (!handleApiError(requestError)) {
        setDeleteError("Account deletion unsuccessful. Please try again.");
      }
    } finally {
      deletionPending.current = false;
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-heading-lg-mobile sm:text-heading-lg">My Profile</h1>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <UserInfo name={currentUser.Username} email={currentUser.Email}
          birthday={toDateInputValue(currentUser.Birthday || currentUser.BirthDate)} />
        <UpdateUser handleSubmit={handleSubmit} setUsername={setUsername} setPassword={setPassword}
          setEmail={setEmail} setBirthday={setBirthday} username={username} password={password}
          email={email} birthday={birthday} isSaving={isSaving} success={success} error={error}
          passwordError={passwordError} setPasswordError={setPasswordError} />
      </div>
      <FavoriteMovies favoriteMovies={favoriteMovies} isLoading={isLoadingMovies} error={movieError}
        hasFavoriteIds={Boolean(currentUser.FavoriteMovies?.length)} />
      <section className="profile-panel border-danger bg-danger-subtle" aria-labelledby="danger-zone-title">
        <h2 id="danger-zone-title" className="mb-4 text-heading-md">Danger Zone</h2>
        <p className="mb-6 text-text-secondary">Deleting your account permanently removes your account information and favorites.</p>
        <button ref={deleteTrigger} type="button" className="button button-danger" disabled={isSaving}
          onClick={() => { setDeleteError(""); setShowModal(true); }}>Delete Account</button>
      </section>
      {showModal && createPortal(
        <div className="profile-dialog-backdrop">
          <div className="absolute inset-0 bg-canvas opacity-90" aria-hidden="true" />
          <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="delete-account-title"
            aria-describedby={deleteError ? "delete-account-description delete-account-error" : "delete-account-description"}
            aria-busy={isDeleting} tabIndex={-1}
            className="surface-elevated relative max-h-[calc(100dvh-32px)] w-full max-w-md overflow-y-auto p-6 sm:p-8">
            <h2 id="delete-account-title" className="mb-4 text-heading-md">Delete Account</h2>
            <p id="delete-account-description" className="mb-6 text-text-secondary">Delete your account permanently? This action cannot be undone.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button ref={cancelButton} type="button" className="button button-secondary" disabled={isDeleting}
                onClick={() => setShowModal(false)}>Cancel</button>
              <button type="button" className="button button-danger" onClick={handleDeleteUser} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
            {deleteError && <p id="delete-account-error" role="alert" className="mt-4 text-text-secondary">{deleteError}</p>}
          </div>
        </div>, document.body
      )}
    </div>
  );
};

ProfileView.propTypes = {
  movies: PropTypes.array.isRequired,
  isLoadingMovies: PropTypes.bool,
  movieError: PropTypes.string,
};

// ===== FILE: src/components/profile-view/update-user.jsx =====
import React from "react";
import PropTypes from "prop-types";

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
  isSaving,
  success = "",
  error = "",
  passwordError = "",
  setPasswordError,
}) {
  return (
    <section className="profile-panel" aria-labelledby="update-account-title">
      <h2 id="update-account-title" className="mb-6 text-heading-md">Update Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4" aria-busy={isSaving}
        aria-describedby={error ? "profile-update-error" : undefined}>
        <div>
          <label htmlFor="profile-username" className="form-label">Username:</label>
          <input id="profile-username" type="text" value={username} onChange={(event) => setUsername(event.target.value)}
            className="form-input" required minLength="3" placeholder="Enter Username" autoComplete="username" />
        </div>
        <div>
          <label htmlFor="profile-password" className="form-label">Password (required to save changes)</label>
          <input id="profile-password" type="password" value={password} onChange={(event) => { setPassword(event.target.value); setPasswordError(""); }}
            onInvalid={(event) => {
              event.preventDefault();
              setPasswordError(event.target.validity.valueMissing
                ? "Enter a password to save profile changes."
                : "Enter a password with at least 5 characters.");
              event.target.focus();
            }}
            className="form-input" required minLength="5" placeholder="Enter Password" autoComplete="new-password"
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={passwordError ? "profile-password-help profile-password-error" : "profile-password-help"} />
          <p id="profile-password-help" className="mt-2 text-body-sm text-text-muted">Enter your current password to keep it, or a different password to change it.</p>
          {passwordError && <p id="profile-password-error" className="mt-2 text-body-sm text-text-muted" role="alert">{passwordError}</p>}
        </div>
        <div>
          <label htmlFor="profile-email" className="form-label">Email:</label>
          <input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)}
            className="form-input" required placeholder="Enter Email" autoComplete="email" />
        </div>
        <div>
          <label htmlFor="profile-birthday" className="form-label">Birthday:</label>
          <input id="profile-birthday" type="date" value={birthday} onChange={(event) => setBirthday(event.target.value)}
            className="form-input" required autoComplete="bday" />
        </div>
        <button type="submit" disabled={isSaving} className="button button-primary">
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
      {success && <p className="mt-4 text-text-secondary" role="status">{success}</p>}
      {error && <p id="profile-update-error" className="mt-4 text-text-secondary" role="alert">{error}</p>}
    </section>
  );
}

UpdateUser.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  birthday: PropTypes.string.isRequired,
  setBirthday: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  success: PropTypes.string,
  error: PropTypes.string,
  passwordError: PropTypes.string,
  setPasswordError: PropTypes.func.isRequired,
};

export default UpdateUser;

// ===== FILE: src/components/profile-view/user-info.jsx =====
import React from "react";
import PropTypes from "prop-types";

function UserInfo({ email, name, birthday }) {
  return (
    <section className="profile-panel" aria-labelledby="account-information-title">
      <h2 id="account-information-title" className="mb-6 text-heading-md">Account Information</h2>
      <dl className="space-y-4">
        <div><dt className="text-label text-text-muted">Username</dt><dd className="mt-1 break-words">{name}</dd></div>
        {email && <div><dt className="text-label text-text-muted">Email</dt><dd className="mt-1 break-words">{email}</dd></div>}
        {birthday && <div><dt className="text-label text-text-muted">Birthday</dt><dd className="mt-1"><time dateTime={birthday}>{birthday}</time></dd></div>}
      </dl>
    </section>
  );
}

UserInfo.propTypes = { email: PropTypes.string, name: PropTypes.string.isRequired, birthday: PropTypes.string };
export default UserInfo;

// ===== FILE: src/components/signup-view/signup-view.jsx =====
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";

// Component for the signup form
export const SignupView = () => {
  const usernameInput = useRef(null);
  const confirmationInput = useRef(null);

  // State variables for form fields and success/failure messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordMismatch = error === "The passwords do not match. Please try again.";

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    // Function to check if passwords match
    function checkPasswordConfirmation(password, confirmPassword) {
      return password === confirmPassword;
    }

    // Check if passwords match
    if (!checkPasswordConfirmation(password, confirmPassword)) {
      setError("The passwords do not match. Please try again.");
      return;
    }

    // Data to be sent in the request
    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    setError("");
    setIsSubmitting(true);
    api
      .signup(data)
      .then(() => setSuccess(true))
      .catch(() => setError("Registration unsuccessful. Please try again."))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="auth-layout">
      <section className="auth-panel" aria-labelledby="signup-title">
        <h1 id="signup-title" className="mb-6 text-heading-lg-mobile sm:text-heading-lg">Signup</h1>
        <form onSubmit={handleSubmit} aria-busy={isSubmitting}
          aria-describedby={error ? "signup-feedback" : undefined} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="signup-username">Username:</label>
            <input ref={usernameInput} id="signup-username" name="username" type="text" value={username}
              onChange={(event) => setUsername(event.target.value)} required
              autoComplete="username" className="form-input" minLength="5" />
          </div>
          <div>
            <label className="form-label" htmlFor="signup-password">Password:</label>
            <input id="signup-password" name="password" type="password" value={password}
              onChange={(event) => setPassword(event.target.value)} required
              autoComplete="new-password" className="form-input"
              aria-invalid={passwordMismatch || undefined} aria-describedby={passwordMismatch ? "signup-feedback" : undefined} />
          </div>
          <div>
            <label className="form-label" htmlFor="signup-confirmPassword">Confirm Password:</label>
            <input ref={confirmationInput} id="signup-confirmPassword" name="confirmPassword" type="password" value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)} required
              autoComplete="new-password" className="form-input"
              aria-invalid={passwordMismatch || undefined} aria-describedby={passwordMismatch ? "signup-feedback" : undefined} />
          </div>
          <div>
            <label className="form-label" htmlFor="signup-email">Email:</label>
            <input id="signup-email" name="email" type="email" value={email}
              onChange={(event) => setEmail(event.target.value)} required
              autoComplete="email" className="form-input" />
          </div>
          <div>
            <label className="form-label" htmlFor="signup-birthday">Birthday:</label>
            <input id="signup-birthday" name="birthday" type="date" value={birthday}
              onChange={(event) => setBirthday(event.target.value)} required
              autoComplete="bday" className="form-input" />
          </div>
          <button type="submit" disabled={isSubmitting} className="button button-primary w-full">
            {isSubmitting ? "Creating account..." : "Signup"}
          </button>
        </form>
        {success && (
          <p className="auth-notice mt-4" role="status">Sign up successful. Account created.</p>
        )}
        {error && (
          <div id="signup-feedback" className="auth-notice mt-4" role="alert">
            <p className="min-w-0 flex-1">{error}</p>
            <button type="button" aria-label="Dismiss message" className="button button-secondary shrink-0 px-3"
              onClick={() => {
                setError("");
                (passwordMismatch ? confirmationInput : usernameInput).current?.focus();
              }}>
              <svg aria-hidden="true" focusable="false" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 6l12 12M6 18L18 6" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
        <p className="mt-6 text-text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Login</Link>
        </p>
      </section>
    </div>
  );
};

// ===== FILE: src/api/client.js =====
import { getApiBaseUrl } from "./config";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const buildUrl = (path) => `${getApiBaseUrl()}/${path.replace(/^\/+/, "")}`;

const getErrorMessage = async (response, profileUpdate) => {
  try {
    const data = await response.json();
    if (profileUpdate && response.status === 422 && Array.isArray(data.errors) &&
      data.errors.some((error) => error.path === "Password" && error.msg === "Password is required")) {
      return "Password is required";
    }
    return data.message || data.error || "The request could not be completed.";
  } catch {
    return "The request could not be completed.";
  }
};

export const request = async (path, options = {}) => {
  const { token, body, headers, profileUpdate = false, ...fetchOptions } = options;
  const response = await fetch(buildUrl(path), {
    ...fetchOptions,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    throw new ApiError(await getErrorMessage(response, profileUpdate), response.status);
  }

  if (response.status === 204) {
    return undefined;
  }

  const contentLength = response.headers?.get?.("content-length");
  if (contentLength === "0") {
    return undefined;
  }

  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

const encode = encodeURIComponent;

export const api = {
  login: (credentials) => request("login", { method: "POST", body: credentials }),
  signup: (user) => request("users", { method: "POST", body: user }),
  getMovies: (token, signal) => request("movies", { token, signal }),
  updateUser: (username, updates, token) =>
    request(`users/${encode(username)}`, { method: "PUT", body: updates, token, profileUpdate: true }),
  deleteUser: (username, token) =>
    request(`users/${encode(username)}`, { method: "DELETE", token }),
  addFavorite: (username, movieId, token) =>
    request(`users/${encode(username)}/movies/${encode(movieId)}`, {
      method: "POST",
      token,
    }),
  removeFavorite: (username, movieId, token) =>
    request(`users/${encode(username)}/movies/${encode(movieId)}`, {
      method: "DELETE",
      token,
    }),
};

// ===== FILE: src/api/config.js =====
export const getApiBaseUrl = () => {
  const baseUrl = process.env.MYFLIX_API_BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error(
      "MYFLIX_API_BASE_URL is required. Set it in your environment before starting the app."
    );
  }

  return baseUrl.replace(/\/+$/, "");
};

// ===== FILE: src/contexts/AppContext.jsx =====
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import { ApiError } from "../api/client";

// Create a context with a default value (null in this case)
const AppContext = createContext(null);

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
};

const storageKeys = ["user", "token"];

const clearStoredAuth = () => {
  storageKeys.forEach((key) => localStorage.removeItem(key));
};

const readStoredAuth = () => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    clearStoredAuth();
    return { user: null, token: null };
  }

  try {
    const user = JSON.parse(storedUser);
    if (!user || typeof user !== "object" || !user.Username) {
      throw new Error("Invalid stored user");
    }
    return { user, token };
  } catch {
    clearStoredAuth();
    return { user: null, token: null };
  }
};

// Create a provider component
export const AppProvider = ({ children }) => {
  const [{ user, token }, setAuth] = useState(readStoredAuth);
  const [sessionNotice, setSessionNotice] = useState("");

  const persistAuth = useCallback((nextUser, nextToken = token) => {
    localStorage.setItem("user", JSON.stringify(nextUser));
    localStorage.setItem("token", nextToken);
    setAuth({ user: nextUser, token: nextToken });
  }, [token]);

  const login = useCallback((nextUser, nextToken) => {
    persistAuth(nextUser, nextToken);
    setSessionNotice("");
  }, [persistAuth]);

  const updateUser = useCallback(
    (nextUser) => persistAuth(nextUser),
    [persistAuth]
  );

  const logout = useCallback((notice = "") => {
    clearStoredAuth();
    setAuth({ user: null, token: null });
    setSessionNotice(notice);
  }, []);

  const clearSessionNotice = useCallback(() => setSessionNotice(""), []);

  const handleApiError = useCallback((error) => {
    if (error instanceof ApiError && [401, 403].includes(error.status)) {
      logout("Your session has expired. Please sign in again.");
      return true;
    }
    return false;
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      sessionNotice,
      login,
      updateUser,
      logout,
      handleApiError,
      clearSessionNotice,
    }),
    [
      user,
      token,
      sessionNotice,
      login,
      updateUser,
      logout,
      handleApiError,
      clearSessionNotice,
    ]
  );

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ===== FILE: src/hooks/useFavorite.js =====
import { useRef, useState } from "react";
import { api } from "../api/client";
import { useAppContext } from "../contexts/AppContext";

// Favorite membership remains owned by the returned user in AppContext.
export const useFavorite = (movieId) => {
  const { user, token, updateUser, handleApiError } = useAppContext();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const requestPending = useRef(false);
  const isFavorite = user?.FavoriteMovies?.includes(movieId) || false;

  const toggleFavorite = async () => {
    if (requestPending.current || !user || !token) return;
    requestPending.current = true;
    setIsPending(true);
    setError("");
    try {
      const updatedUser = isFavorite
        ? await api.removeFavorite(user.Username, movieId, token)
        : await api.addFavorite(user.Username, movieId, token);
      updateUser(updatedUser);
    } catch (requestError) {
      if (!handleApiError(requestError)) {
        setError("Favorites could not be updated. Please try again.");
      }
    } finally {
      requestPending.current = false;
      setIsPending(false);
    }
  };

  return { isFavorite, isPending, error, toggleFavorite };
};

// ===== FILE: src/index.jsx =====
import React from "react";
import { createRoot } from "react-dom/client";
import MainView from "./components/main-view/main-view";
import "./index.css";
import { AppProvider } from "./contexts/AppContext";
import { getApiBaseUrl } from "./api/config";

// Surface a missing public API configuration as soon as the application starts.
getApiBaseUrl();

// Main component (will eventually use all the others)
const MyFlixApplication = () => {
  return (
    <AppProvider>
      <div className="app-shell">
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
