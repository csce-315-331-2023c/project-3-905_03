import React from 'react';
import MenuTable from './MenuTable';
import AddMenuModal from './AddMenuModal';

const ManagerMenu: React.FC = () => {
    return (
      <div>
        <MenuTable/>
        <AddMenuModal/>
      </div>
    );
  };
  
  export default ManagerMenu;