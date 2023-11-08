// ManagerNav.tsx
import React, { useState } from 'react';
import '../Styles/ManagerNav.css';

interface ManagerNavProps {
    setActiveSection: (section: string) => void;
}

const ManagerNav: React.FC<ManagerNavProps> = ({ setActiveSection }) => {
    const [userOpen, setUserOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [ordersOpen, setOrdersOpen] = useState(false);
    const [analyticsOpen, setAnalyticsOpen] = useState(false);

    return (
        <div className="manager-nav">
            <div className="nav-item">
                <button onClick={() => {
                    setActiveSection('User');
                    setUserOpen(!userOpen);
                }}>User</button>
                {userOpen}
            </div>
            
            <div className="nav-item">
                <button onClick={() => {
                    setActiveSection('Menu');
                    setMenuOpen(!menuOpen);
                }}>Menu</button>
                {menuOpen}
            </div>
            <div className="nav-item">
                <button onClick={() => {
                    setActiveSection('Inventory');
                    setInventoryOpen(!inventoryOpen);
                }}>Inventory</button>
                {inventoryOpen}
            </div>
            <div className="nav-item">
                <button onClick={() => {
                    setActiveSection('Orders');
                    setOrdersOpen(!ordersOpen);
                }}>Orders</button>
                {ordersOpen}
            </div>
            <div className="nav-item">
                <button onClick={() => {
                    setActiveSection('Analytics');
                    setAnalyticsOpen(!analyticsOpen);
                }}>Analytics</button>
                {analyticsOpen}
            </div>
            
        </div>
    );
};

export default ManagerNav;
