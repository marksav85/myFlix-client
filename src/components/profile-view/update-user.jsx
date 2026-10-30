import React from 'react';
import PropTypes from 'prop-types';

function UpdateUser({
  handleSubmit,
  username,
  setUsername,
  usernameError = '',
  password,
  setPassword,
  email,
  setEmail,
  birthday,
  setBirthday,
  birthdayRequired,
  isSaving,
  success = '',
  error = '',
  passwordError = '',
  setPasswordError,
}) {
  return (
    <section className="profile-panel" aria-labelledby="update-account-title">
      <h2 id="update-account-title" className="mb-6 text-heading-md">
        Update Account
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-busy={isSaving}
        aria-describedby={error ? 'profile-update-error' : undefined}
      >
        <div>
          <label htmlFor="profile-username" className="form-label">
            Username:
          </label>
          <input
            id="profile-username"
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            className="form-input"
            required
            placeholder="Enter Username"
            autoComplete="username"
            aria-invalid={usernameError ? true : undefined}
            aria-describedby={usernameError ? 'profile-username-error' : undefined}
          />
          {usernameError && (
            <p
              id="profile-username-error"
              className="mt-2 text-body-sm text-text-muted"
              role="alert"
            >
              {usernameError}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="profile-password" className="form-label">
            Password (optional)
          </label>
          <input
            id="profile-password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setPasswordError('');
            }}
            className="form-input"
            placeholder="Leave blank to keep your password"
            autoComplete="new-password"
            aria-invalid={passwordError ? true : undefined}
            aria-describedby={
              passwordError
                ? 'profile-password-help profile-password-error'
                : 'profile-password-help'
            }
          />
          <p id="profile-password-help" className="mt-2 text-body-sm text-text-muted">
            Leave blank to keep your password. New passwords need at least 8 characters and may not
            exceed 72 UTF-8 bytes. An unchanged legacy password shorter than 8 characters is also
            accepted.
          </p>
          {passwordError && (
            <p
              id="profile-password-error"
              className="mt-2 text-body-sm text-text-muted"
              role="alert"
            >
              {passwordError}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="profile-email" className="form-label">
            Email:
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="form-input"
            required
            placeholder="Enter Email"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="profile-birthday" className="form-label">
            Birthday:
          </label>
          <input
            id="profile-birthday"
            type="date"
            value={birthday}
            onChange={(event) => setBirthday(event.target.value)}
            className="form-input"
            required={birthdayRequired}
            autoComplete="bday"
          />
        </div>
        <button type="submit" disabled={isSaving} className="button button-primary">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      {success && (
        <p className="mt-4 text-text-secondary" role="status">
          {success}
        </p>
      )}
      {error && (
        <p id="profile-update-error" className="mt-4 text-text-secondary" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

UpdateUser.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  usernameError: PropTypes.string,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  birthday: PropTypes.string.isRequired,
  setBirthday: PropTypes.func.isRequired,
  birthdayRequired: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  success: PropTypes.string,
  error: PropTypes.string,
  passwordError: PropTypes.string,
  setPasswordError: PropTypes.func.isRequired,
};

export default UpdateUser;
