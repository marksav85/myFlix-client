import { useState } from 'react';

export const LoginView = ({ onLoggeedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault(); //prevents default refresh upon submit

    const data = {
      Username: username,
      Password: password
    };
  
    fetch('https://my-flix-films-d4434240379d.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login response: ", data);
        if (data.user) {
          onLoggeedIn(data.user, data.token);
        } else {
          alert("No such user");
        }
      })
      .catch((error) => {
        alert("Something went wrong");
      });

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          required
        />
      </label>
      <label>
        Password:
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};