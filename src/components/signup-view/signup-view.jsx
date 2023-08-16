export const SignupView = () => {

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
  };

  fetch('https://myflixdbapp.herokuapp.com/users', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      alert('Sign up successful!');
      window.location.reload();
    } else {
      alert('Sign up failed');
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
          minLength="3"
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
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </label>
      <label>
        Birthday:
        <input
          type="date"
          value={birthday}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};