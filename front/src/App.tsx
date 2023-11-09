import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ManagerGUI from './ManagerUI/Pages/Manager';
import Cashier from './CashierUI/Pages/Cashier';
import CustomerKiosk from './CustomerUI/Pages/Customer';
import DynamicMenu from './DynamicMenu/Pages/DynamicMenu';
import LoginPage from './SharedComponents/Login';
import ProtectedRoute from './SharedComponents/ProtectedRoute';
import { AuthProvider } from './SharedComponents/AuthContext';
import './styles/App.css';

function App() {
  const googleClientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;
  console.log(googleClientId);
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/customer-kiosk" element={<CustomerKiosk />} />
            <Route path="/dynamic-menu" element={<DynamicMenu />} />
            <Route element={<ProtectedRoute allowedRoles={['Manager']} />}>
              <Route path="/manager" element={<ManagerGUI />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['Cashier']} />}>
              <Route path="/cashier" element={<Cashier />} />
            </Route>
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default App;

/*
Note: Protected Routes Functionality intersection with OAuth
*/