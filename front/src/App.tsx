import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ManagerGUI from './ManagerUI/Pages/Manager';
import Cashier from './CashierUI/Pages/Cashier';
import CustomerKiosk from './CustomerUI/Pages/CustomerKiosk';
import DynamicMenu from './DynamicMenu/Pages/DynamicMenu';
import LoginPage from './SharedComponents/Login';
import ProtectedRoute from './SharedComponents/ProtectedRoute';
import { AuthProvider } from './SharedComponents/AuthContext';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/customer-kiosk" element={<CustomerKiosk />} />
            <Route path="/dynamic-menu" element={<DynamicMenu />} />
            <Route path="/cashier2" element={<Cashier />} />
            <Route element={<ProtectedRoute allowedRoles={['manager','f']} />}>
              <Route path="/manager" element={<ManagerGUI />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['cashier','f']} />}>
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
