import React, {useState} from 'react';
import Table from './Table';
import AddMenuModal from './AddMenuModal';

const ManagerMenu: React.FC = () => {
    return (
      <div>
        <Table/>
        <AddMenuModal/>
      </div>
    );
  };
  
  export default ManagerMenu;