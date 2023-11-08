
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useAuth } from './AuthContext';

import './Styles/Login.css';

const authorizedManagers = ['revmya09@tamu.edu', 'ry4ntr1@gmail.com'];
const authorizedCashiers = ['samuel.cole@tamu.edu', 'kotda@tamu.edu'];

interface CustomJwtPayload {
  email: string;
  given_name: string;
  family_name: string;
}

const LoginPage = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [authError, setAuthError] = useState(false);

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const toggleSettingsModal = () => {
    setShowSettingsModal(!showSettingsModal);
  };

  const handleManualLoginSubmit = () => {
    const parsedId = parseInt(id, 10);
    let role: 'Manager' | 'Cashier' | undefined;

    const managers = {
      manager1: 123,
      manager2: 456,
      manager3: 789
    };

    const cashiers = {
      cashier1: 111,
      cashier2: 222,
      cashier3: 333
    };

    if (role) {
      setUser({
        firstName: name,
        role: role,
        isAuthenticated: true
      });

      console.log(`${name} authenticated:`, true);
      setAuthError(false);
      navigate(`/${role.toLowerCase()}`);

    } else {
      console.log('Manual Login Failed');
      setAuthError(true);
    }
  };

  const handleGoogleLoginSuccess = async (response: any) => {
    console.log(response);
    const idToken = response.credential;

    try {
      const decoded: CustomJwtPayload = jwtDecode(idToken);
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
        console.log('Unauthorized Access');

      }
    } catch (error) {
      console.error('Error decoding the JWT:', error);
    }
  };

  const handleGoogleLoginError = () => {
    console.error('');
  };

  const handleGuestAccess = () => {
    navigate('/customer-kiosk');
  };


  return (
    <div className="login-container">
      <div className='login-top'>
        {authError && (
          <div className="error-message">
            Authentication failed. Please try again.
          </div>
        )}
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

        <div className='vertical-divider'></div>

        <div className="guest-options">
          <h1>Continue as Guest</h1>
          <button className="kiosk-button" onClick={handleGuestAccess}>Customer Kiosk</button>
        </div>

      </div>
      
      <div className="login-bottom">
        <button className="settings-button" onClick={handleGuestAccess}>
          Language
        </button>
        <button className="settings-button" onClick={handleGuestAccess}>
          Accessibility
        </button>
      </div>

    </div>
  );
};

export default LoginPage;
