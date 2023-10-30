// ManagerGUI.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManagerNav from '../Components/ManagerNav';
import MenuTable from '../Components/MenuTable';  // Import MenuTable here

import '../Styles/Manager.css';
import InventoryTable from '../Components/InventoryTable';
import OrdersTable from '../Components/OrdersTable';

const ManagerGUI: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    // Example API call
    axios.get('/api/some-data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching data", error);
      });
  }, []);

  return (
    <div className="manager-container">
      <div className="lhs">
        <ManagerNav setActiveSection={setActiveSection} />
      </div>
      <div className="rhs">
              {activeSection === 'Menu' && <MenuTable />}
              {activeSection === 'Inventory' && <InventoryTable />}
              {activeSection === 'Orders' && <OrdersTable />}
            
        {/* ...other conditional rendering based on activeSection */}
      </div>
    </div>
  );
};

export default ManagerGUI;
