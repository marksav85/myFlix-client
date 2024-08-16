import React, { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";

// eslint-disable-next-line react/prop-types
export const LoginView = ({ onLoggedIn }) => {
  // State variables to manage the input values for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fail, setFail] = useState(false);
  const { baseUrl } = useAppContext();

  // Function to refresh the page
  const refresh = () => window.location.reload(true);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    // Data object to be sent to the server
    const data = {
      Username: username,
      Password: password,
    };

    // Send a POST request to the login endpoint
    fetch(`${baseUrl}/login`, {
      method: "POST",
      body: JSON.stringify(data), // Convert the data object to a JSON string
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
    })
      .then((response) => response.json()) // Convert the response to JSON
      .then((data) => {
        console.log("Login response: ", data); // Log the response data
        if (data.user) {
          // If login is successful, store the user and token in localStorage
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          onLoggedIn(data.user, data.token); // Call the onLoggedIn callback with the user and token
        } else {
          setFail(true); // Set fail state to true if response is not OK
        }
      })
      .catch((e) => {
        alert("Something went wrong" + e); // Alert if there is an error during the request
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Center the login form vertically and horizontally */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Container for the form with background, padding, rounded corners, and shadow */}
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {/* Form title */}
        <form onSubmit={handleSubmit}>
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
