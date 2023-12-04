import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ManagerGUI from './ManagerUI/Pages/Manager';
import Cashier from './CashierUI/Pages/Cashier';
import CustomerKiosk from './CustomerUI/Pages/CustomerKiosk';
import DynamicMenu from './DynamicMenu/Pages/DynamicMenu';
import LoginPage from './SharedComponents/Login';
import ProtectedRoute from './SharedComponents/ProtectedRoute';
import { AuthProvider } from './SharedComponents/AuthContext';
import { ModalProvider } from './SharedComponents/ModalContext';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  console.log(googleClientId);
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <BrowserRouter>
          <ModalProvider>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/customer-kiosk" element={<CustomerKiosk />} />
              <Route path="/dynamic-menu" element={<DynamicMenu />} />
              <Route path="/cashier2" element={<Cashier />} />
              <Route element={<ProtectedRoute allowedRoles={['manager', 'admin']} />}>
                <Route path="/manager" element={<ManagerGUI />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['cashier', 'admin']} />}>
                <Route path="/cashier" element={<Cashier />} />
              </Route>
              <Route path="*" element={<LoginPage />} />
            </Routes>
          </ModalProvider>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>

  );
}

export default App;
