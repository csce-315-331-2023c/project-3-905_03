import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ManagerGUI from './ManagerUI/Pages/Manager';
import Cashier from './CashierUI/Pages/Cashier';
import CustomerKiosk from './CustomerUI/Pages/Customer';
import DynamicMenu from './DynamicMenu/Pages/DynamicMenu';
import LoginPage from './SharedComponents/Login';  // Import the LoginPage component
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/manager" element={<ManagerGUI />} />
        <Route path="/cashier" element={<Cashier />} />
        <Route path="/customer-kiosk" element={<CustomerKiosk />} />
        <Route path="/dynamic-menu" element={<DynamicMenu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;