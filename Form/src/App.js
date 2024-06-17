import logo from './logo.svg';
import './App.css';
import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './register';
import Login from './Login';
import Home from './home';
// import Protected from './Protected';
import axios from 'axios';
function App() {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

 
 
  return (
 
    <Router>
    <div>
      <h1>My App</h1>
      <Routes>
        {/* <Route path="/" element={<Navigate replace to="/register" />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/protected" element={<Protected />} /> */}
      </Routes>
    </div>
  </Router>
  );
}

export default App;
