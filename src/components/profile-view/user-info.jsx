import React from "react";

function UserInfo({ email, name }) {
  return (
    <>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
    </>
  );
}

export default UserInfo;
