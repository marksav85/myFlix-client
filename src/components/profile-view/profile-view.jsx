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
    savingPending.current = true;
    setSuccess("");
    setError("");
    setIsSaving(true);

    const updates = { Username: username, Email: email, Birthday: birthday };
    if (password) updates.Password = password;

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
        setError("Update unsuccessful. Please try again.");
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
          email={email} birthday={birthday} isSaving={isSaving} success={success} error={error} />
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
