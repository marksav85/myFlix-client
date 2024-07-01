import React from "react";

function UserInfo({ email, name }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Your Details</h3>
      <p className="mb-1">Name: {name}</p>
      <p className="mb-1">Email: {email}</p>
    </div>
  );
}

export default UserInfo;
