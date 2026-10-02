import React from "react";
import PropTypes from "prop-types";

function UserInfo({ email, name, birthday }) {
  return (
    <section className="profile-panel" aria-labelledby="account-information-title">
      <h2 id="account-information-title" className="mb-6 text-heading-md">Account Information</h2>
      <dl className="space-y-4">
        <div><dt className="text-label text-text-muted">Username</dt><dd className="mt-1 break-words">{name}</dd></div>
        {email && <div><dt className="text-label text-text-muted">Email</dt><dd className="mt-1 break-words">{email}</dd></div>}
        {birthday && <div><dt className="text-label text-text-muted">Birthday</dt><dd className="mt-1"><time dateTime={birthday}>{birthday}</time></dd></div>}
      </dl>
    </section>
  );
}

UserInfo.propTypes = { email: PropTypes.string, name: PropTypes.string.isRequired, birthday: PropTypes.string };
export default UserInfo;
