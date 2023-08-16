import { useState } from 'react';

export const LoginView = ({ onLoggeedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault(); //prevents default refresh upon submit

    const data = {
      access: username,
      secret: password
    };
  
    fetch('https://my-flix-films-d4434240379d.herokuapp.com/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then((response) => {
      if (response.ok) {
        onLoggedIn(username);
      } else {
        alert("Login failed");
      }
    });
  };

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