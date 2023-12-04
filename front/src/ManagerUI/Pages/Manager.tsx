import React, { useState } from 'react';
import ManagerNav from '../Components/ManagerNav';
import MenuTable2 from '../Components/MenuTable2';
import FamilyTable from '../Components/FamilyTable';
import InventoryTable2 from '../Components/InventoryTable2';
import OrdersTable4 from '../Components/OrdersTable4';
import ManagerAnalytics from '../Components/ManagerAnalytics';
import User from '../../SharedComponents/User';
import '../Styles/Manager.css';

const ManagerGUI: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('Menu');


  const componentMapping: { [key: string]: React.FC } = {
    Menu: MenuTable2,
    Families: FamilyTable,
    Inventory: InventoryTable2,
    Orders: OrdersTable4,
    Analytics: ManagerAnalytics,
    User: User,
  };

  const ActiveComponent = componentMapping[activeSection] || null;

  return (
    <div style={{ height: '100vh', overflow: 'auto'}}>
      <div>
        <ManagerNav setActiveSection ={setActiveSection} />
      </div>
      <div>
        {ActiveComponent && <ActiveComponent/>}
      </div>
    </div>
  );
};

export default ManagerGUI;
