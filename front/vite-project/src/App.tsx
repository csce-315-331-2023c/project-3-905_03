import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ManagerGUI from './ManagerUI/Pages/Manager';
import Cashier from './CashierUI/Pages/Cashier';
import CustomerKiosk from './CustomerUI/Pages/Customer';
import DynamicMenu from './DynamicMenu/Pages/DynamicMenu';
import LoginPage from './SharedComponents/Login';
import './styles/App.css';

function App() {
  return (
    <GoogleOAuthProvider clientId="898628945684-94dn9ro8j5i7kohesa0gjqdgnukrlb9u.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/manager" element={<ManagerGUI />} />
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/customer-kiosk" element={<CustomerKiosk />} />
          <Route path="/dynamic-menu" element={<DynamicMenu />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App; 