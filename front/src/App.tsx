
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import React, {useEffect} from 'react';

import ManagerGUI from './ManagerUI/Pages/Manager';
import Cashier from './CashierUI/Pages/Cashier';
import CustomerKiosk from './CustomerUI/Pages/CustomerKiosk';
import DynamicMenu from './DynamicMenu/Pages/CustomerMenu';
import DynamicTVMenu1 from './DynamicMenu/Pages/DynamicTVMenu1';
import DynamicTVMenu2 from './DynamicMenu/Pages/DynamicTVMenu2';
import KitchenDisplay from './KitchenDisplay/Pages/KitchenDisplay';
import LoginPage from './SharedComponents/Login';
import ProtectedRoute from './SharedComponents/ProtectedRoute';
import { AuthProvider } from './SharedComponents/AuthContext';
import { ModalProvider } from './SharedComponents/ModalContext';

/**
 * `App` is the main React component that wraps all other components and provides routing.
 * 
 * @remarks
 * This component sets up the authentication provider, Google OAuth provider, and the router.
 * It defines routes for the login page, customer kiosk, dynamic menu, TV menus, cashier, kitchen display, and manager GUI.
 * It also sets up protected routes for the cashier, kitchen display, and manager GUI that require the user to have certain roles.
 * 
 * @returns The rendered `App` component
 */

declare global {
  interface Window {
    google: any;
  }
}

function App() {
  

  return (
    <AuthProvider>
      <BrowserRouter>
        <ModalProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/customer-kiosk" element={<CustomerKiosk />} />
            <Route path="/customer-menu" element={<DynamicMenu />} />
            <Route path="/TV1" element={<DynamicTVMenu1 />} />
            <Route path="/TV2" element={<DynamicTVMenu2 />} />
            <Route element={<ProtectedRoute allowedRoles={['manager', 'admin']} />}>
              <Route path="/manager" element={<ManagerGUI />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['cashier', 'admin']} />}>
              <Route path="/cashier" element={<Cashier />} />
              <Route path="/kitchen" element={<KitchenDisplay />} />
            </Route>
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </ModalProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
