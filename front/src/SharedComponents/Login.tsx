import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './AuthContext';
import { useModal } from './ModalContext';
import ErrorModal from './ErrorModal';
import AccessibilityModal from './AccessibilityModal';
import RoleSelectionModal from './RoleSelectionModal';
import IconButton from '@mui/material/IconButton';
import TranslateIcon from '@mui/icons-material/Translate';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import './Styles/Login.css';
import axios from 'axios';

interface CustomJwtPayload {
  email: string;
  given_name: string;
  family_name: string;
}

const oAuthFailureMessage = "You are not authorized to access this application.";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { showErrorModal, setShowErrorModal, showRoleSelectionModal, setShowRoleSelectionModal, authErrorMessage, setAuthErrorMessage, showAccessibilityModal, setShowAccessibilityModal } = useModal();
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    console.log("Modal state changed:", showRoleSelectionModal);
    if (!showRoleSelectionModal && selectedRole) {
      console.log("Navigating to:", `/${selectedRole}`);
      navigate(`/${selectedRole}`);
      setSelectedRole('');
    }
  }, [showRoleSelectionModal, selectedRole, navigate]);


  

  const handleManualLoginSubmit = async () => {
    try {
      const errors = validateForm();
      if (errors.email || errors.password) {
        setAuthErrorMessage(errors.email || errors.password);
        setShowErrorModal(true);
        return;
      }

      const response = await axios.post('/auth/manual/login', { email, password });

      if (response.status == 200) {
        console.log("Client Received 200 OK");
        console.log("response.data: ", response.data);
      }

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser({ ...user, role: user.role, isAuthenticated: true });

      if (user.role === 'cashier') {
        navigate('/cashier');
      } else if (user.role === 'manager') {
        navigate('/manager');
      } else if (user.role === 'admin') {
        setShowRoleSelectionModal(true);
      }

    } catch (error: any) {
      setAuthErrorMessage(error.response?.data || 'Manual Authentication Failed: Invalid Credentials');
      setShowErrorModal(true);
    }
  };

  const handleGoogleLoginSuccess = async (response: any) => {
    const idToken = response.credential;

    try {
      const decoded: CustomJwtPayload = jwtDecode(idToken);

      const userEmail = decoded.email;
      const userFirstName = decoded.given_name;
      const userLastName = decoded.family_name;

      const response = await axios.post('/auth/google/login', { userEmail, userFirstName, userLastName});

      if (response.status == 200) {
        console.log("Client Received 200 OK");
        console.log("response.data: ", response.data);
      } else {
        setShowErrorModal(true);
      }

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser({ ...user, role: user.role, isAuthenticated: true });

      if (user.role === 'cashier') {
        navigate('/cashier');
      } else if (user.role === 'manager') {
        navigate('/manager');
      } else if (user.role === 'admin') {
        setShowRoleSelectionModal(true);
      }
       else {
        handleGoogleLoginError();
        setShowErrorModal(true);
      }
    } catch (error) {
      setAuthErrorMessage('Failed Google OAuth');
      setShowErrorModal(true);
    }
  };

  const handleGoogleLoginError = () => {
    setAuthErrorMessage(oAuthFailureMessage);
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

  return (
    <>
      <div className={`login-container ${showErrorModal || showRoleSelectionModal ? 'blur-background' : ''}`}>
        <div className="logo-container">
          {/* <img src={logo} alt="Mess Waffles" width={200} height={75}/> */}
          <h1>Mess Waffles</h1>
        </div>
        <div className='login-top'>
          <div className="manual-login">
            <h1>Sign In</h1>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                width={220}
              />

            </div>
          </div>
          <div className="vertical-divider" />
          <div className="guest-options">
            <h1>Continue as Guest</h1>
            <button className="login-button" onClick={handleAccessKiosk}>Customer Kiosk</button>
            <button className="login-button" onClick={handleAccessMenu}>View Menu</button>
          </div>
        </div>


        <div className="login-bottom">
          <IconButton className="mui-icon-button">
            <TranslateIcon />
          </IconButton>
          <IconButton className="mui-icon-button" onClick={handleAccessibilityModal}>
            <AccessibilityIcon />
            <AccessibilityModal
              isOpen={showAccessibilityModal}
              onClose={() => setShowAccessibilityModal(false)}
            />
          </IconButton>
        </div>

      </div>
      <ErrorModal
        isOpen={showErrorModal}
        errorMessage={authErrorMessage}
        onClose={handleErrorModal}
      />
      <RoleSelectionModal
        isOpen={showRoleSelectionModal}
        onClose={handleRoleSelectionModal}
      />
    </>
  );
};

export default LoginPage;
