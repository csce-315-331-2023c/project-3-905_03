import React, { useState } from 'react';
import ManagerNav from '../Components/ManagerNav';
import MenuTable from '../Components/MenuTable';
import InventoryTable from '../Components/InventoryTable';
import OrdersTable from '../Components/OrdersTable';
import OrdersTable2 from '../Components/OrdersTable2';
import ManagerAnalytics from '../Components/ManagerAnalytics';
import '../Styles/Manager.css';

const ManagerGUI: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('Menu');


  const componentMapping: { [key: string]: React.FC } = {
    Menu: MenuTable,
    Inventory: InventoryTable,
    Orders: OrdersTable,
    Analytics: ManagerAnalytics,
  };

  const ActiveComponent = componentMapping[activeSection] || null;

  return (
    <div className="manager-container">
      <div className="lhs">
        <ManagerNav setActiveSection ={setActiveSection} />
      </div>
      <div className="rhs">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default ManagerGUI;
