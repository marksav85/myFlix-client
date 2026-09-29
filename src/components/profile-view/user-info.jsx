import React from "react";
import PropTypes from "prop-types";

function UserInfo({ email, name }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Your Details</h3>
      <p className="mb-1">Name: {name}</p>
      <p className="mb-1">Email: {email}</p>
    </div>
  );
}

UserInfo.propTypes = {
  email: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default UserInfo;
