import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ManagerGUI from './ManagerUI/Pages/Manager';
import Cashier from './CashierUI/Pages/Cashier';
import CustomerKiosk from './CustomerUI/Pages/Customer';
import DynamicMenu from './DynamicMenu/Pages/DynamicMenu';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="app-container">
            <h1>Welcome to Mess UI</h1>
            <p>
              Modified: File Structure, App.tsx 
            </p>
            <p>@Revanth: This branch is based off your branch.</p>
            <p>Note: Depending on who does OAuth, we can just have a single employee sign-in button, onClick calls  Login Modal + Auth Modal and based on role open the corresponding GUI </p>
            <p>
              Note: This file structure is slightly different, if anything one can argue its more complex than the original, but I think its more organized tbh. We obv don't have to adopt it
              but I think it might be a good idea to try it out.
              <b>Important: see directory_tree.txt in the projects root directory to simplify integration, shouldn't be too bad</b>
            </p>
            <div className="landing-container">
              <Link className="card" to="/manager">Manager</Link>
              <Link className="card" to="/cashier">Cashier</Link>
              <Link className="card" to="/customer-kiosk">Kiosk</Link>
              <Link className="card" to="/dynamic-menu">Display Menu</Link>
            </div>
            
          </div>
        } />
        <Route path="/manager" element={<ManagerGUI />} />
        <Route path="/cashier" element={<Cashier />} />
        <Route path="/customer-kiosk" element={<CustomerKiosk />} />
        <Route path="/dynamic-menu" element={<DynamicMenu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;