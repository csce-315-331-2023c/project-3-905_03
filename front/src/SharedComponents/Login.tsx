import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {  jwtDecode } from 'jwt-decode';
import { useAuth, User } from './AuthContext';
import { useModal } from './ModalContext';
import ErrorModal from './ErrorModal';
import { IconButton, InputAdornment } from '@mui/material';
import { TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Divider from '@mui/material/Divider';
import GoogleSignIn from './GoogleSignIn';

import './Styles/Login.css';
import useStyles from './Styles/useStyles.ts';

import axios from 'axios';
import AppBar from './AppBar.tsx';

const LoginPage = () => {
  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser} = useAuth();
  const navigate = useNavigate();
  const { showErrorModal, setShowErrorModal, showRoleSelectionModal, setShowRoleSelectionModal, errorMessage, setErrorMessage } = useModal();

  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  const google_API_key = import.meta.env.VITE_GOOGLE_API_KEY;

  // Handlers / Helpers
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const handleGoogleLoginError = () => {
    setErrorMessage('OAuth Credentials Invalid.');
    setShowErrorModal(true);
  };

  const handleErrorModal = () => {
    setShowErrorModal(!showErrorModal);
  }

  const handleAccessMenu = () => {
    navigate('/customer-menu');
  };

  const handleAccessKiosk = () => {
    navigate('/customer-kiosk');
  }

  const handleLoginError = (error: any, defaultMessage: string) => {
    let errorMessage = defaultMessage;
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'Unauthorized: Invalid credentials.';
          break;
        case 403:
          errorMessage = 'Forbidden: Access denied.';
          break;
        case 500:
          errorMessage = 'Internal Server Error: Please try again later.';
          break;
        default:
          break;
      }
    }
    setErrorMessage(errorMessage);
    setShowErrorModal(true);
  };

  const initUserSession = (accessToken: any, refreshToken: any) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken); 

    const decodedUser: User = jwtDecode(accessToken); 
    setUser({ ...decodedUser }); 
    navigateBasedOnRole(decodedUser.role); 
  };

  const validateForm = () => {
    const errors = { email: '', password: '' };
    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
    if (!password) errors.password = 'Password is required';
    return errors;
  };

  const navigateBasedOnRole = (role: string) => {
    if (role === 'cashier') {
      navigate('/cashier');
    } else if (role === 'manager') {
      navigate('/manager');
    } else if (role === 'customer') {
      navigate('/customer-kiosk');
    }
    else if (role === 'admin') {
      setShowRoleSelectionModal(true);
    }
  };

  // Login: Manual
  const handleManualLoginSubmit = async () => {
    try {
      const errors = validateForm();
      if (errors.email || errors.password) {
        handleLoginError(errors.email || errors.password, 'Invalid email or password.');
        return;
      }
      console.log('Client: Making a fetch request to /auth/manual/login with email:', email);
      const response = await axios.post('/auth/manual/login', { email, password });
      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;
        initUserSession(accessToken, refreshToken);
      } else {
        handleLoginError(response.status, 'Manual Authentication Failed');
      }
    } catch (error: any) {
      handleLoginError(error, 'Manual Authentication Failed');
    }
  };

  // Login: GoogleOAuth
  const handleGoogleLoginSuccess = async (response: any) => {
    const idToken = response.credential;
    try {
      console.log('Client: Google Login Success, requesting verification from server with token: ', idToken);
      const serverResponse = await axios.post('/auth/google/login', { idToken });
      if (serverResponse.status === 200) {
        console.log('Client: Received data from /auth/google/login', serverResponse.data);
        const { accessToken, refreshToken } = serverResponse.data;
        initUserSession(accessToken, refreshToken);
      } else {
        handleLoginError(serverResponse.status, 'Google Authentication Failed: Invalid Credentials');
      }
    } catch (error: any) {
      handleLoginError(error, 'Google Authentication Failed: Invalid Credentials');
    }
  };

  return (
    <>
      <div className={`login-container ${showErrorModal || showRoleSelectionModal ? 'blur-background' : ''}`}>
        <AppBar />
        <div className='login-top'>
          <div className="manual-login">
            <h1>Sign In</h1>
            <TextField
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={classes.textFieldCustom}
              variant="outlined"
              className='login-input'
            />

            <TextField
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              sx={classes.textFieldCustom}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disableRipple
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              className='login-input'
            />

            <button className="login-button" onClick={handleManualLoginSubmit}>
              Submit
            </button>
            {/* <div className="google-auth">
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
            </div> */}
            <GoogleSignIn initUserSession={initUserSession} handleLoginError={handleGoogleLoginError} />
          </div>
          <Divider orientation="vertical" flexItem sx={{ backgroundColor: '#ffffff', height: '80%' }} />
          <div className="guest-options">
            <h1>Guest Options</h1>
            <button className="login-button" onClick={handleAccessKiosk}>Customer Kiosk</button>
            <button className="login-button" onClick={handleAccessMenu}>View Menu</button>
          </div>
        </div>
      </div>
      <ErrorModal
        isOpen={showErrorModal}
        errorMessage={errorMessage}
        onClose={handleErrorModal}
      />

    </>
  );
};

export default LoginPage;
