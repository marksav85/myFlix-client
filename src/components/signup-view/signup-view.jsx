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
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordMismatch = Boolean(fieldErrors.ConfirmPassword);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const fieldProps = (field, help) => ({
    "aria-invalid": fieldErrors[field] ? true : undefined,
    "aria-describedby": [help, fieldErrors[field] ? `signup-${field}-error` : null].filter(Boolean).join(" ") || undefined,
  });
  const fieldMessage = (field) => fieldErrors[field] && (
    <p id={`signup-${field}-error`} className="mt-2 text-body-sm text-text-muted">{fieldErrors[field]}</p>
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    const form = event.currentTarget;
    const errors = {};
    if (!/^[A-Za-z0-9]{5,}$/.test(username)) {
      errors.Username = "Enter at least 5 characters using letters and numbers only; no spaces or symbols.";
    }
    if (Array.from(password).length < 8) errors.Password = "Enter a password with at least 8 characters.";
    else if (new TextEncoder().encode(password).length > 72) errors.Password = "Password must not exceed 72 UTF-8 bytes.";
    if (!confirmPassword || password !== confirmPassword) errors.ConfirmPassword = "The passwords do not match. Please try again.";
    if (!email || form.elements.email.validity.typeMismatch) errors.Email = "Enter a valid email address.";
    if (birthday) {
      const parsed = new Date(`${birthday}T00:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== birthday) {
        errors.Birthday = "Enter a valid date in YYYY-MM-DD format.";
      } else if (birthday > today) errors.Birthday = "Birthday must not be in the future.";
    }
    setFieldErrors(errors);
    setSuccess(false);
    if (Object.keys(errors).length) {
      setError(errors.ConfirmPassword || "Please correct the highlighted fields.");
      form.querySelector(`[data-field="${Object.keys(errors)[0]}"]`)?.focus();
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await api.signup({ Username: username, Password: password, Email: email, ...(birthday ? { Birthday: birthday } : {}) });
      setSuccess(true);
    } catch (requestError) {
      const errors = {};
      for (const issue of requestError.errors || []) {
        if (["Username", "Password", "Email", "Birthday"].includes(issue.path)) errors[issue.path] = issue.msg;
      }
      if (requestError.status === 400 && !Object.keys(errors).length) errors.Username = requestError.message;
      setFieldErrors(errors);
      setError(Object.keys(errors).length ? "Please correct the highlighted fields." : "Registration unsuccessful. Please try again.");
      if (Object.keys(errors).length) form.querySelector(`[data-field="${Object.keys(errors)[0]}"]`)?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-panel" aria-labelledby="signup-title">
        <h1 id="signup-title" className="mb-6 text-heading-lg-mobile sm:text-heading-lg">Signup</h1>
        <p className="mb-4 text-body-sm text-text-muted">All fields are required except Birthday.</p>
        <form noValidate onSubmit={handleSubmit} aria-busy={isSubmitting}
          aria-describedby={error ? "signup-feedback" : undefined} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="signup-username">Username:</label>
            <input ref={usernameInput} id="signup-username" name="username" type="text" value={username}
              onChange={(event) => setUsername(event.target.value)} required
              autoComplete="username" className="form-input" minLength="5" pattern="[A-Za-z0-9]+"
              data-field="Username" {...fieldProps("Username", "signup-username-help")} />
            <p id="signup-username-help" className="mt-2 text-body-sm text-text-muted">At least 5 characters. Letters and numbers only; no spaces or symbols.</p>
            {fieldMessage("Username")}
          </div>
          <div>
            <label className="form-label" htmlFor="signup-password">Password:</label>
            <input id="signup-password" name="password" type="password" value={password}
              onChange={(event) => setPassword(event.target.value)} required
              autoComplete="new-password" className="form-input" minLength="8"
              data-field="Password" {...fieldProps("Password", "signup-password-help")} />
            <p id="signup-password-help" className="mt-2 text-body-sm text-text-muted">At least 8 characters.</p>
            {fieldMessage("Password")}
          </div>
          <div>
            <label className="form-label" htmlFor="signup-confirmPassword">Confirm Password:</label>
            <input ref={confirmationInput} id="signup-confirmPassword" name="confirmPassword" type="password" value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)} required
              autoComplete="new-password" className="form-input"
              data-field="ConfirmPassword" {...fieldProps("ConfirmPassword")} />
            {fieldMessage("ConfirmPassword")}
          </div>
          <div>
            <label className="form-label" htmlFor="signup-email">Email:</label>
            <input id="signup-email" name="email" type="email" value={email}
              onChange={(event) => setEmail(event.target.value)} required
              autoComplete="email" className="form-input" data-field="Email" {...fieldProps("Email")} />
            {fieldMessage("Email")}
          </div>
          <div>
            <label className="form-label" htmlFor="signup-birthday">Birthday (optional):</label>
            <input id="signup-birthday" name="birthday" type="date" value={birthday}
              onChange={(event) => setBirthday(event.target.value)} max={today}
              autoComplete="bday" className="form-input" data-field="Birthday" {...fieldProps("Birthday")} />
            {fieldMessage("Birthday")}
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
                setFieldErrors({});
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
