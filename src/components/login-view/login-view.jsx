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
