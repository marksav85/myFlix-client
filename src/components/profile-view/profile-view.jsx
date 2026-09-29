import React, { useEffect, useMemo, useState } from "react";
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

export const ProfileView = ({ movies }) => {
  const { user, token, updateUser, logout, handleApiError } = useAppContext();
  const currentUser = user || emptyUser;
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
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    setError("");
    setIsDeleting(true);
    try {
      await api.deleteUser(currentUser.Username, token);
      logout();
    } catch (requestError) {
      if (!handleApiError(requestError)) {
        setError("Account deletion unsuccessful. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="user-containers">
          <div className="bg-white shadow-md rounded-lg p-4">
            <UserInfo name={currentUser.Username} email={currentUser.Email} />
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
              isSaving={isSaving}
            />
          </div>
          {success && <p className="mt-4 text-green-700" role="status">{success}</p>}
          {error && <p className="mt-4 text-yellow-700" role="alert">{error}</p>}
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <FavoriteMovies favoriteMovies={favoriteMovies} />
      </div>

      <button id="button" className="font-bold py-2 px-4 rounded" onClick={() => setShowModal(true)}>
        Delete account
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
          <div className="absolute inset-0 bg-gray-900 opacity-75" />
          <div className="bg-white p-8 rounded-lg max-w-md w-full z-50">
            <h3 id="delete-account-title" className="text-lg font-bold mb-4">Delete account</h3>
            <p className="mb-4">Are you sure?</p>
            <div className="flex justify-end">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleDeleteUser} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Yes"}
              </button>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={() => setShowModal(false)} disabled={isDeleting}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ProfileView.propTypes = {
  movies: PropTypes.array.isRequired,
};
