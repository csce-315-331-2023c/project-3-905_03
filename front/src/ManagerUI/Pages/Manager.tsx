import React, { useState } from 'react';
import ManagerNav from '../Components/ManagerNav';
import MenuTable from '../Components/MenuTable';
import MenuTable2 from '../Components/MenuTable2';
import InventoryTable from '../Components/InventoryTable';
import InventoryTable2 from '../Components/InventoryTable2';
import OrdersTable from '../Components/OrdersTable';
import OrdersTable4 from '../Components/OrdersTable4';
import ManagerAnalytics from '../Components/ManagerAnalytics';
import '../Styles/Manager.css';

const ManagerGUI: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('Menu');


  const componentMapping: { [key: string]: React.FC } = {
    Menu: MenuTable2,
    Inventory: InventoryTable2,
    Orders: OrdersTable4,
    Analytics: ManagerAnalytics,
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
