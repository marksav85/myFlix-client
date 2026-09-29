import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { api } from "../../api/client";

export const LoginView = () => {
  // State variables to manage the input values for username and password
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
              disabled={isSubmitting}
              className=" text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isSubmitting ? "Signing in..." : "Submit"}
            </button>
            {/* Submit button */}
          </div>
        </form>

        {/* Container for the alert message */}
        <div className="mt-4 w-full max-w-md">
          {/* Display failure message if fail state is true */}
          {(error || sessionNotice) && (
            <div
              className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error || sessionNotice}</span>
              <button
                type="button"
                aria-label="Dismiss message"
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => {
                  setError("");
                  clearSessionNotice();
                }}
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
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
