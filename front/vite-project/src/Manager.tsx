import React from 'react';
import { useNavigate } from 'react-router-dom'

type Props = {
  name: string;
  age: number;
  employees: string[];
};



const Manager: React.FC<Props> = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the Manager page!</h1>
      <button onClick={() => navigate("/manage-menu")}>Manage Menu</button>
      <button>Manage Inventory</button>
      <button>Manage Orders</button>
      <button>Analytics</button>
    </div>
  );
};

export default Manager;
