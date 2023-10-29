import React, {useState} from 'react';
import MenuTable from './MenuTable';
import AddMenuModal from './AddMenuModal';

const ManagerMenu: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
      <div>
        <MenuTable/>
        <button className='btn' onClick={() => setModalOpen(true)}>Create New Menu Item</button>
        {modalOpen && <AddMenuModal closeModal={() => (
            setModalOpen(false)
        )}/>}
      </div>
    );
  };
  
  export default ManagerMenu;