import React from 'react';
import { useNavigate } from 'react-router-dom'

const Manager: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the Manager page!</h1>
      <button onClick={() => navigate("/manager-menu")}>Manage Menu</button>
      <button onClick={() => navigate("/manager-inventory")}>Manage Inventory</button>
      <button onClick={() => navigate("/manager-orders")}>Manage Orders</button>
      <button onClick={() => navigate("/manager-analytics")}>Analytics</button>
    </div>
  );
};

export default Manager;
