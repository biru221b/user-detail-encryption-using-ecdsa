// src/Register.js
import React, { useState } from 'react';

const Register = () => {
  const [name, setName] = useState('');
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [citizenshipNumber, setCitizenshipNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
        try {
          const response = await fetch('http://localhost:5000/api/auth/signup', {
            // credentials: 'include',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Custom-Header': 'CustomHeaderValue' // Add any custom headers if needed
            },
            body: JSON.stringify({
              email,
              userName,
              password,
            }),
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log(data.signature);
          localStorage.setItem('userinfo', JSON.stringify(data));
          localStorage.setItem('signature', JSON.stringify(data.signature));
          
          // console.log(data);
          // <Redirect to="/home" />
        
    // Here you would typically handle the registration logic, e.g., send data to a server
    alert('Registered Successfully');
  }
  catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
  console.log({ name, userName, email, password, citizenshipNumber });
  };

  return (
    <div>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit} method='post'>
       
        <div>
          <label>Username:</label>
          <input type="text" value={userName} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
       
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
