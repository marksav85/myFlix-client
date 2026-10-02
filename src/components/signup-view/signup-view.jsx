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
