import React, { useState } from "react";
import { Link } from "react-router-dom";

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
    fetch("https://my-flix-films-d4434240379d.herokuapp.com/users", {
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
            onChange={(e) => setUsername(e.target.value)} // Update username state on change
            required
            minLength="5"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
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
            onChange={(e) => setPassword(e.target.value)} // Update password state on change
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email:
          </label>
          {/* Email input field */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state on change
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="birthday"
          >
            Birthday:
          </label>
          {/* Birthday input field */}
          <input
            type="date"
            id="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)} // Update birthday state on change
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <p>Unsuccessful. Unable to create account. Please try again.</p>
            <button
              onClick={refresh}
              id="button"
              className=" text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
            >
              Close
            </button>
            {/* Button to refresh the page */}
          </div>
        )}
      </div>
    </div>
  );
};
