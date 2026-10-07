import React from "react";
import PropTypes from "prop-types";

function UpdateUser({
  handleSubmit,
  username,
  setUsername,
  password,
  setPassword,
  email,
  setEmail,
  birthday,
  setBirthday,
  isSaving,
  success = "",
  error = "",
  passwordError = "",
  setPasswordError,
}) {
  return (
    <section className="profile-panel" aria-labelledby="update-account-title">
      <h2 id="update-account-title" className="mb-6 text-heading-md">Update Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4" aria-busy={isSaving}
        aria-describedby={error ? "profile-update-error" : undefined}>
        <div>
          <label htmlFor="profile-username" className="form-label">Username:</label>
          <input id="profile-username" type="text" value={username} onChange={(event) => setUsername(event.target.value)}
            className="form-input" required minLength="3" placeholder="Enter Username" autoComplete="username" />
        </div>
        <div>
          <label htmlFor="profile-password" className="form-label">Password (required to save changes)</label>
          <input id="profile-password" type="password" value={password} onChange={(event) => { setPassword(event.target.value); setPasswordError(""); }}
            onInvalid={(event) => {
              event.preventDefault();
              setPasswordError(event.target.validity.valueMissing
                ? "Enter a password to save profile changes."
                : "Enter a password with at least 5 characters.");
              event.target.focus();
            }}
            className="form-input" required minLength="5" placeholder="Enter Password" autoComplete="new-password"
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={passwordError ? "profile-password-help profile-password-error" : "profile-password-help"} />
          <p id="profile-password-help" className="mt-2 text-body-sm text-text-muted">Enter your current password to keep it, or a different password to change it.</p>
          {passwordError && <p id="profile-password-error" className="mt-2 text-body-sm text-text-muted" role="alert">{passwordError}</p>}
        </div>
        <div>
          <label htmlFor="profile-email" className="form-label">Email:</label>
          <input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)}
            className="form-input" required placeholder="Enter Email" autoComplete="email" />
        </div>
        <div>
          <label htmlFor="profile-birthday" className="form-label">Birthday:</label>
          <input id="profile-birthday" type="date" value={birthday} onChange={(event) => setBirthday(event.target.value)}
            className="form-input" required autoComplete="bday" />
        </div>
        <button type="submit" disabled={isSaving} className="button button-primary">
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
      {success && <p className="mt-4 text-text-secondary" role="status">{success}</p>}
      {error && <p id="profile-update-error" className="mt-4 text-text-secondary" role="alert">{error}</p>}
    </section>
  );
}

UpdateUser.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  birthday: PropTypes.string.isRequired,
  setBirthday: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  success: PropTypes.string,
  error: PropTypes.string,
  passwordError: PropTypes.string,
  setPasswordError: PropTypes.func.isRequired,
};

export default UpdateUser;
