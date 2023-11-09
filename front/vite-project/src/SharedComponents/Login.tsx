
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useAuth } from './AuthContext';
import ErrorModal from './ErrorModal';

import './Styles/Login.css';

const authorizedManagers = ['samuel.cole@tamu.edu', 'revmya09@tamu.edu', 'kotda@tamu.edu' ,'ry4ntr1@gmail.com','ryanwtree@gmail.com', 'rwt@tamu.edu'];
const authorizedCashiers = ['samuel.cole@tamu.edu', 'revmya09@tamu.edu', 'kotda@tamu.edu', 'ry4ntr1@gmail.com', 'ryanwtree@gmail.com', 'rwt@tamu.edu'];

interface CustomJwtPayload {
  email: string;
  given_name: string;
  family_name: string;
}

const manualVerificationFailureMessage = "Please enter a valid name or valid id. If you continue to encounter issues, contact support.";
const oAuthFailureMessage = "We're unable to log you in using OAuth at this time. Please try again later or use manual sign-in.";


const LoginPage = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const { setUser } = useAuth();
  const [authError, setAuthError] = useState(false);
  const [showAuthError, setShowAuthError] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState('');

  const [showSettingsModal, setShowSettingsModal] = useState(false);


  const toggleSettingsModal = () => {
    setShowSettingsModal(!showSettingsModal);
  };

  const toggleAuthError = () => {
    setShowAuthError(!showAuthError);
  }

  useEffect(() => {
    const body = document.querySelector('body');
    if (!body) return;
    if (authError) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }

    // Cleanup function to reset the overflow when the component unmounts or the modal is closed
    return () => {
      body.style.overflow = 'auto';
    };
  }, [authError]); // Depend on authError to re-run the effect

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

      
      setAuthError(false);
      navigate(`/${role.toLowerCase()}`);

    } else {
      console.log('Manual Login Failed');
      setAuthErrorMessage('You are not authorized to access this application.'); // Set the error message
      setAuthError(true);
    }
  };

  const handleGoogleLoginSuccess = async (response: any) => {
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

  const handleGuestAccess = () => {
    navigate('/customer-kiosk');
  };

  return (

    <>
      <div className={`login-container ${authError ? 'blur-background' : ''}`}>
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
              />


              {/* <div id="g_id_onload"
              data-client_id="898628945684-94dn9ro8j5i7kohesa0gjqdgnukrlb9u.apps.googleusercontent.com"
              data-context="signin"
              data-ux_mode="popup"
              data-login_uri="http://localhost:5173/"
              data-itp_support="true">
            </div>

            <div className="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="filled_black"
              data-text="signin_with"
              data-size="large"
              data-locale="en-US"
              data-logo_alignment="left">
            </div> */}
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
      <ErrorModal
        isOpen={authError}
        errorMessage={authErrorMessage}
        onClose={() => setAuthError(false)}
      />
    </>
  );
};

export default LoginPage;
