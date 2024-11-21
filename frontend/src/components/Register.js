import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logoImage from '../assets/images/josh-Photoroom (1).png';

const Register = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    axios.post('/api/signup', {
      username: email,
      password,
      firstName,
      lastName,
    })
      .then((response) => {
        setMessage(response.data.message); // Display success message
      })
      .catch((error) => {
        setMessage(error.response?.data?.error || 'An error occurred'); // Display error message
      });
  };

  return (
    <div className="auth-container">
      <img src={logoImage} alt="Logo" className="auth-logo" />
      <h2>Create your account</h2>
    
      <p>
        Have an account? <a className='hyplink' href="/login">Log in now</a>
      </p>
      
      <form onSubmit={handleRegister}>
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="text" 
          placeholder="First Name" 
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required 
        />
        <input 
          type="text" 
          placeholder="Last Name" 
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">Sign Up</button>
      </form>
      
      <p className='or'>Or with Google</p>
      <button className="auth-button google">
        <i className="fab fa-google"></i> Google
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Register;
