import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logoImage from '../assets/images/josh-Photoroom (1).png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('/api/login', { username: email, password })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage(error.response?.data?.error || 'An error occurred');
      });
  };

  return (
    <div className="auth-container">
      <img src={logoImage} alt="Logo" className="auth-logo" />
      <h2>Log in to your account</h2>
      <p>
        Don't have an account? <a className='hyplink' href="/register">Sign Up</a>
      </p>
      
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">Next</button>
      </form>

      <p className='or'>Or with Google</p>
      <button className="auth-button google">
        <i className="fab fa-google"></i> Google
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;
