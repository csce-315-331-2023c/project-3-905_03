import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useAuth } from './AuthContext';
import ErrorModal from './ErrorModal';

import logo from '../assets/mess-white.png';

import IconButton from '@mui/material/IconButton';
import TranslateIcon from '@mui/icons-material/Translate';
import AccessibilityIcon from '@mui/icons-material/Accessibility';


import './Styles/Login.css';

const authorizedManagers = ['samuel.cole@tamu.edu', 'revmya09@tamu.edu', 'kotda@tamu.edu',  'ryanwtree@gmail.com', 'rwt@tamu.edu'];
const authorizedCashiers = ['samuel.cole@tamu.edu', 'revmya09@tamu.edu', 'kotda@tamu.edu', 'ry4ntr1@gmail.com', 'ryanwtree@gmail.com', 'rwt@tamu.edu'];

interface CustomJwtPayload {
  email: string;
  given_name: string;
  family_name: string;
}

const oAuthFailureMessage = "You are not authorized to access this application.";

const LoginPage = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const { setUser } = useAuth();
  const [authError, setAuthError] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState('');


  useEffect(() => {
    const body = document.querySelector('body');
    if (!body) return;
    if (authError) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }

    return () => {
      body.style.overflow = 'auto';
    };
  }, [authError]);

  const handleManualLoginSubmit = () => {
    let role: 'Manager' | 'Cashier' | undefined;

    if (role) {
      setUser({
        firstName: name,
        role: role,
        isAuthenticated: true
      });


      setAuthError(false);
      navigate(`/${role.toLowerCase()}`);

    } else {
      console.log('Manual Login Failed');
      setAuthErrorMessage('Invalid credentials. Please try again.');
      setAuthError(true);
    }
  };

  const handleGoogleLoginSuccess = async (response: any) => {
    const idToken = response.credential;
    console.log(`OAuth request origin: ${window.location.href}`);

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
        handleGoogleLoginError();
        setAuthError(true);
      }
    } catch (error) {
      console.error('Error decoding the JWT:', error);
    }
  };

  const handleGoogleLoginError = () => {
    setAuthErrorMessage(oAuthFailureMessage);
  };

  const handleAccessKiosk = () => {
    navigate('/customer-kiosk');
  };

  const handleAccessMenu = () => {
    navigate('/dynamic-menu');
  };

  return (
    <>
      <div className={`login-container ${authError ? 'blur-background' : ''}`}>
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>
        <div className='login-top'>
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
                width={250}
              />

            </div>
          </div>

          <div className="guest-options">
            <h1>Continue as Guest</h1>
            <button className="login-button" onClick={handleAccessKiosk}>Customer Kiosk</button>
            <button className="login-button" onClick={handleAccessMenu}>View Menu</button>
          </div>
        </div>


        <div className="login-bottom">
          <IconButton className="mui-icon-button language" onClick={handleAccessKiosk}>
            <TranslateIcon />
          </IconButton>
          <IconButton className="mui-icon-button" onClick={handleAccessKiosk}>
            <AccessibilityIcon />
          </IconButton>
        </div>

      </div>
      <ErrorModal
        isOpen={authError}
        errorMessage={authErrorMessage}
        onClose={() => setAuthError(false)}
      />
    </>
  );
};

export default LoginPage;