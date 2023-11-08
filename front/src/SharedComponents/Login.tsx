import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import  { jwtDecode } from "jwt-decode"; // Use jwt_decode, jwtDecode was a typo
import './Styles/Login.css';
import { useAuth, User } from './AuthContext';

const managers = {
  'Revanth': 0,
  'Ryan': 1,
};

const cashiers = {
  'Sam': 0,
  'Kotda': 1,
};

const authorizedManagers = ['revmya09@tamu.edu', 'ry4ntr1@gmail.com'];
const authorizedCashiers = ['samuel.cole@tamu.edu', 'kotda@tamu.edu'];

interface CustomJwtPayload {
  email: string;
  given_name: string;
  family_name: string;
  // ... add other fields you expect from the JWT
}

const LoginPage = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleManualLoginSubmit = () => {
    const parsedId = parseInt(id, 10);
    let role: 'Manager' | 'Cashier' | undefined;

    if (Object.values(managers).includes(parsedId)) {
      role = 'Manager';
    } else if (Object.values(cashiers).includes(parsedId)) {
      role = 'Cashier';
    }

    if (role) {
      setUser({
        firstName: name,
        role: role,
        isAuthenticated: true,
        
      });
      console.log(`${name} authenticated:`, true);
      navigate(`/${role.toLowerCase()}`);
    } else {
      console.log('Manual Login Failed');
    }
  };

  const handleGoogleLoginSuccess = async (response: any) => {
    console.log(response);
    const idToken = response.credential;

    try {
      const decoded: CustomJwtPayload = jwtDecode(idToken); // Correctly typing the decoded payload
      const role = authorizedManagers.includes(decoded.email) ? 'Manager'
        : authorizedCashiers.includes(decoded.email) ? 'Cashier'
          : undefined;

      if (role) {
        setUser({
          email: decoded.email,
          firstName: decoded.given_name,
          lastName: decoded.family_name,
          role: role,
          isAuthenticated: true
        });
        navigate(`/${role.toLowerCase()}`);
      } else {
        console.log('Unauthorized access');
        // Handle unauthorized access, perhaps navigate to an error page or show a message
      }
    } catch (error) {
      console.error('Error decoding the JWT:', error);
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google login failed');
  };

  return (
    <div className="login-container">
      <div className="manual-login">
        <h1>Sign In</h1>
        <input
          type="text" 
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
        {/* Pass the id state to the click handler */}
        <button className="login-button" onClick={() => handleManualLoginSubmit()}>
          Submit
        </button>
        <div className="google-auth">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            useOneTap
            text='continue_with'
            theme='filled_black'
            size='large'
            logo_alignment='center'
          />
        </div>
      </div>
      
      <div className="vertical-divider"></div>

      <div className="guest-access">
        <h1>Continue as Guest</h1>
        <button className="kiosk-button">Customer Kiosk</button>
      </div>
    </div>
  );
};

export default LoginPage;
