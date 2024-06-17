// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
  const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Dummy login logic for demonstration purposes
//     if (email === 'test@example.com' && password === 'password') {
//       alert('Login Successful');
//       navigate('/protected');
//     } else {
//       alert('Invalid credentials');
//     }
//   };

const handleSubmit = async (e) => {
  
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
