// LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Login.css';

declare global {
  interface Window {
    google: any;
  }
}

const managers: Record<string, number> = {
  'Revanth': 1,
  'Ryan': 2,
};

const cashiers: Record<string, number> = {
  'Sam': 3,
  'Kotda': 4,
};

const authorizedManagers = ['revmya09@tamu.edu', 'ry4ntr1@gmail.com'];
const authorizedCashiers = ['samuel.cole@tamu.edu', 'kotda@tamu.edu'];

function LoginPage() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const navigate = useNavigate();


  const handleSubmit = () => {
    const parsedId = parseInt(id, 10);
    if (managers[name] === parsedId) {
      navigate('/manager');
    } else if (cashiers[name] === parsedId) {
      navigate('/cashier');
    } else {
      console.log('Invalid credentials');
    }
  };

  const handleGoogleCallback = (response: any) => {
    const email = response.getBasicProfile().getEmail();
    if (authorizedManagers.includes(email)) {
      navigate('/manager');
    } else if (authorizedCashiers.includes(email)) {
      navigate('/cashier');
    } else {
      console.log('Unauthorized access');
    }
  };

  return (
    <div className="login-container">
      <div className="manual-login">
        <h1>Login</h1>
        <input
          type="text"
          className="login-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="login-input"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button className="login-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      <div className="google-auth">
        <div id="buttonDiv"></div>
      </div>
    </div>
  );
}

export default LoginPage;
