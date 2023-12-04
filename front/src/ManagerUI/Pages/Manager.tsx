import React, { useState } from 'react';
import ManagerNav from '../Components/ManagerNav';
import MenuTable2 from '../Components/MenuTable2';
import InventoryTable2 from '../Components/InventoryTable2';
import OrdersTable4 from '../Components/OrdersTable4';
import ManagerAnalytics from '../Components/ManagerAnalytics';
import User from '../../SharedComponents/User';
import '../Styles/Manager.css';

const ManagerGUI: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('Menu');

  const componentMapping: { [key: string]: React.FC } = {
    Menu: MenuTable2,
    Inventory: InventoryTable2,
    Orders: OrdersTable4,
    Analytics: ManagerAnalytics,
    User: User,
  };

  const ActiveComponent = componentMapping[activeSection] || null;

  return (
    <div className="manager-container">
      <div className="lhs">
        <ManagerNav setActiveSection={setActiveSection} />
      </div>
      <div className="rhs">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default ManagerGUI;