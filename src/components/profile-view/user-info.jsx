import React from "react";

function UserInfo({ email, name }) {
  return (
    <>
      <h3>Your Details</h3>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
    </>
  );
}

export default UserInfo;
