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
