import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/v1/merchant/login', {
        username,
        password,
      });
      if (response.data.token) {
        // Store the token in local storage
        localStorage.setItem('jwtToken', response.data.token);
        console.log('Login successful:', response.data);
        // Redirect or do something else
      }
    //   console.log('Login successful:', response.data);
      // Redirect to a different page on successful login
      navigate('/Risk-dashboard'); // Change '/dashboard' to your desired path
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="inputContainer">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="inputContainer">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="button">Login</button>
      </form>
      <p className="signup-message">
        Don't have an account? <button className="signup-button" onClick={() => navigate('/sign-up')}>Create an Account</button>
      </p>
    </div>
  );
};

export default Login;
