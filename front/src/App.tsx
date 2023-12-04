import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ManagerGUI from './ManagerUI/Pages/Manager';
import Cashier from './CashierUI/Pages/Cashier';
import CustomerKiosk from './CustomerUI/Pages/CustomerKiosk';
import DynamicMenu from './DynamicMenu/Pages/DynamicMenu';
import DynamicTVMenu1 from './DynamicMenu/Pages/DynamicTVMenu1';
import DynamicTVMenu2 from './DynamicMenu/Pages/DynamicTVMenu2';
import KitchenDisplay from './KitchenDisplay/Pages/KitchenDisplay';
import LoginPage from './SharedComponents/Login';
import ProtectedRoute from './SharedComponents/ProtectedRoute';
import { AuthProvider } from './SharedComponents/AuthContext';
import { ModalProvider } from './SharedComponents/ModalContext';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <ModalProvider>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/customer-kiosk" element={<CustomerKiosk />} />
              <Route path="/dynamic-menu" element={<DynamicMenu />} />
              <Route path="/dynamic-tv-menu1" element={<DynamicTVMenu1 />} />
              <Route path="/dynamic-tv-menu2" element={<DynamicTVMenu2 />} />
              <Route path="/cashier2" element={<Cashier />} />
              <Route path="/kitchen-display2" element={<KitchenDisplay />} />
              <Route element={<ProtectedRoute allowedRoles={['manager', 'admin']} />}>
                <Route path="/manager" element={<ManagerGUI />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['cashier', 'admin']} />}>
                <Route path="/cashier" element={<Cashier />} />
                <Route path="/kitchen-display" element={<KitchenDisplay />} />
              </Route>
              <Route path="*" element={<LoginPage />} />
            </Routes>
          </ModalProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default App;
