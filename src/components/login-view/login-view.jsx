import React, { useState } from "react";

// eslint-disable-next-line react/prop-types
export const LoginView = ({ onLoggedIn }) => {
  // State variables to manage the input values for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    // Data object to be sent to the server
    const data = {
      Username: username,
      Password: password,
    };

    // Send a POST request to the login endpoint
    fetch("https://my-flix-films-d4434240379d.herokuapp.com/login", {
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
          alert("No such user"); // Alert if the user does not exist
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
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password:
            </label>
            {/* Password input field */}
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update the password state on change
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
            {/* Submit button */}
          </div>
        </form>
      </div>
    </div>
  );
};
