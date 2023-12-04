import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './AuthContext';
import { useModal } from './ModalContext';
import ErrorModal from './ErrorModal';
import AccessibilityModal from './AccessibilityModal';
import RoleSelectionModal from './RoleSelectionModal';
import TranslateIcon from '@mui/icons-material/Translate';
import { IconButton, InputAdornment } from '@mui/material';
import { TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import Divider from '@mui/material/Divider';

import './Styles/Login.css';
import useStyles from './Styles/useStyles.ts';

import axios from 'axios';
import MessLogo from './MessLogo.tsx';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { showErrorModal, setShowErrorModal, showRoleSelectionModal, setShowRoleSelectionModal, errorMessage, setErrorMessage ,showAccessibilityModal, setShowAccessibilityModal } = useModal();
  const [selectedRole, setSelectedRole] = useState('');

  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event:any) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (!showRoleSelectionModal && selectedRole) {
      navigate(`/${selectedRole}`);
      setSelectedRole('');
    }
  }, [showRoleSelectionModal, selectedRole, navigate]);

  const logMessage = (action: string, message: string) => {
    console.log(`Action: ${action} | Info: ${message}`);
  };

  const handleManualLoginSubmit = async () => {
    try {
      const errors = validateForm();
      if (errors.email || errors.password) {
        setErrorMessage("validateForm(): " + (errors.email || errors.password));
        setShowErrorModal(true);
        return;
      }
      const response = await axios.post('/auth/manual/login', { email, password });
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);

        const decodedUser:any = jwtDecode(token);
        setUser({...decodedUser });
        navigateBasedOnRole(decodedUser.role);
      } else {
        setErrorMessage(response.data.message);
        setShowErrorModal(true);
      }
    } catch (error:any) {
      setErrorMessage(error.response?.data.message || 'Manual Authentication Failed: Invalid Credentials');
      setShowErrorModal(true);
    }
  };

  const handleGoogleLoginSuccess = async (response: any) => {
    const idToken = response.credential;
    try {
      const serverResponse = await axios.post('/auth/google/login', { idToken });
      if (serverResponse.status === 200) {
        const { token } = serverResponse.data;
        localStorage.setItem('token', token);

        const decodedUser: any = jwtDecode(token);
        console.log(decodedUser);
        setUser({...decodedUser });
        navigateBasedOnRole(decodedUser.role);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data.message || 'Google Authentication Failed: Invalid Credentials');
      setShowErrorModal(true);
    }

  };


  const handleGoogleLoginError = () => {
    logMessage('GoogleLogin', 'Login failed');
    setErrorMessage('You are not authorized to access this application.');
    setShowErrorModal(true);
  };

  const handleAccessibilityModal = () => {
    setShowAccessibilityModal(!showAccessibilityModal);
  }

  const handleErrorModal = () => {
    setShowErrorModal(!showErrorModal);
  }

  const handleRoleSelectionModal = (role = '') => {
    setShowRoleSelectionModal(!showRoleSelectionModal);
    if (role) {
      setSelectedRole(role);
    }
  }

  const handleAccessMenu = () => {
    navigate('/dynamic-menu');
  };

  const handleAccessKiosk = () => {
    navigate('/customer-kiosk');
  }

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
    } else if (role === 'admin') {
      setShowRoleSelectionModal(true);
    }
  };

  return (
    <>
      <div className={`login-container ${showErrorModal || showRoleSelectionModal ? 'blur-background' : ''}`}>
        <div className="logo-container">
          <MessLogo />
        </div>
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
          <Divider orientation="vertical" flexItem sx={{backgroundColor:'#ffffff'} } />
          <div className="guest-options">
            <h1>Guest Options</h1>
            <button className="login-button" onClick={handleAccessKiosk}>Customer Kiosk</button>
            <button className="login-button" onClick={handleAccessMenu}>View Menu</button>
          </div>
        </div>
        <div className="login-bottom">
          <IconButton className="mui-icon-button"  >
            <TranslateIcon sx={classes.iconButton} />
          </IconButton>
          <IconButton className="mui-icon-button" onClick={handleAccessibilityModal}>
            <AccessibilityIcon sx={classes.iconButton} />
          </IconButton>
        </div>
      </div>
      <ErrorModal
        isOpen={showErrorModal}
        errorMessage={errorMessage}
        onClose={handleErrorModal}
      />
      <RoleSelectionModal
        isOpen={showRoleSelectionModal}
        onClose={handleRoleSelectionModal}
      />
      <AccessibilityModal
        isOpen={showAccessibilityModal}
        onClose={() => setShowAccessibilityModal(false)}
      />
    </>
  );
};

export default LoginPage;
