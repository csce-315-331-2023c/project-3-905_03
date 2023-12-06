import React, { useState } from 'react';
import ManagerNav from '../Components/ManagerNav';
import MenuTable2 from '../Components/MenuTable2';
import FamilyTable from '../Components/FamilyTable';
import InventoryTable2 from '../Components/InventoryTable2';
import OrdersTable4 from '../Components/OrdersTable4';
import ManagerAnalytics from '../Components/ManagerAnalytics';
import User from '../../SharedComponents/User';
import '../Styles/Manager.css';
import EmployeesTable from '../Components/EmployeesTable';
import CustomersTable from '../Components/CustomersTable';

/**
 * `ManagerGUI` is a React component that displays the main interface for managers.
 * 
 * @remarks
 * This component maintains the state for the active section and whether the navigation drawer is open.
 * It maps section names to their corresponding components.
 * It renders the `ManagerNav` component and the component for the active section.
 * 
 * @returns The rendered `ManagerGUI` component
 */
const ManagerGUI: React.FC = () => {

  const [activeSection, setActiveSection] = useState<string>('Orders');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);



  const componentMapping: { [key: string]: React.FC<{ isDrawerOpen: boolean }> } = {
    Menu: MenuTable2,
    Families: FamilyTable,
    Inventory: InventoryTable2,
    Orders: OrdersTable4,
    Analytics: ManagerAnalytics,
    User: User,
    Employees: EmployeesTable,
    Customers: CustomersTable,
  };

  const ActiveComponent = componentMapping[activeSection] || null;

  return (
    <div className="manager-container">
      <div className={`lhs ${!isDrawerOpen ? 'lhs-closed' : ''}`}>
        <ManagerNav
          setActiveSection={setActiveSection}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      </div>
      <div className={`rhs ${!isDrawerOpen ? 'rhs-expanded' : ''}`}>
        {ActiveComponent && <ActiveComponent isDrawerOpen={isDrawerOpen} />}
      </div>
    </div>
  );
};

export default ManagerGUI;