import React, { useState } from 'react';
import ManagerNav from '../Components/ManagerNav';
import MenuTable from '../Components/MenuTable';  

import '../Styles/Manager.css';
import InventoryTable from '../Components/InventoryTable';
import OrdersTable from '../Components/OrdersTable';
import AddMenuModal from '../Components/AddMenuModal';

const ManagerGUI: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="manager-container">
      <div className="lhs">
        <ManagerNav setActiveSection={setActiveSection} />
      </div>
      <div className="rhs">
              {activeSection === 'Menu' && <MenuTable />}
              {activeSection === 'Inventory' && <InventoryTable />}
              {activeSection === 'Orders' && <OrdersTable />}
            
      </div>
    </div>
  );
};

export default ManagerGUI;
