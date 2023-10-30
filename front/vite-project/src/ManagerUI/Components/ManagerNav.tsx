import React, { useState } from 'react';
import '../Styles/ManagerNav.css';

const ManagerNav: React.FC = () => {
    const [userSettings, setUserOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [ordersOpen, setOrdersOpen] = useState(false);
    const [analyticsOpen, setAnalyticsOpen] = useState(false);

    return (
        <div className="manager-nav">
            <div className="nav-item">
                <button onClick={() => setUserOpen(!userSettings)}>User</button>
                {userSettings && (
                    <div className="dropdown">
                        <div>Edit</div>
                        <div>Logout</div>
                    </div>
                )}
            </div>
            <div className="nav-item">
                <button onClick={() => setMenuOpen(!menuOpen)}>Menu</button>
                {menuOpen && (
                    <div className="dropdown">
                        <div>View Menu</div>
                        <div>Add Menu Item</div>
                        <div>Edit Menu Item</div>
                        <div>Delete Menu Item</div>
                        <div>Search Menu Item</div>
                    </div>
                )}
            </div>

            <div className="nav-item">
                <button onClick={() => setInventoryOpen(!inventoryOpen)}>Inventory</button>
                {inventoryOpen && (
                    <div className="dropdown">
                        <div>View Inventory</div>
                        <div>Add Inventory Item</div>
                        <div>Edit Inventory Item</div>
                        <div>Delete Inventory Item</div>
                        <div>Search Inventory Item</div>
                    </div>
                )}
            </div>

            <div className="nav-item">
                <button onClick={() => setOrdersOpen(!ordersOpen)}>Orders</button>
                {ordersOpen && (
                    <div className="dropdown">
                        <div>Recent</div>
                        <div>Search</div>
                    </div>
                )}
            </div>

            <div className="nav-item">
                <button onClick={() => setAnalyticsOpen(!analyticsOpen)}>Analytics</button>
                {analyticsOpen && (
                    <div className="dropdown">
                        <div>Usage</div>
                        <div>Sales</div>
                        <div>Excess</div>
                        <div>Frequently Paired</div>
                        <div>Restock</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerNav;
