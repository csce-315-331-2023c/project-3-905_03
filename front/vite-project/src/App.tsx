import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from './Menu'
import Manager from './Manager'
import Login from './Login'
import ManagerMenu from './Manager-Menu';
import ManagerInventory from './Manager-Inventory';
import ManagerOrders from './Manager-Orders';
import ManagerAnalytics from './Manager-Analytics';

interface Props {
  name: string;
  age: number;
  employees: string[];
}

function App() {
  const [name, setName] = useState('John')
  const [age, setAge] = useState(30)
  const [employees, setEmployees] = useState(['Alice', 'Bob', 'Charlie'])

  // const menuItems: MenuItem[] = [
  //   { label: 'Home', link: '/' },
  //   { label: 'Manager', link: '/manager' },
  // ];

  return (
    <>
      <BrowserRouter>
        {/* <Menu items={menuItems} /> */}
        <Routes>
          <Route path="/manager" element={<Manager />} />
          <Route path="/manager-menu" element={<ManagerMenu />} />
          <Route path="/manager-inventory" element={<ManagerInventory />} />
          <Route path="/manager-orders" element={<ManagerOrders />} />
          <Route path="/manager-analytics" element={<ManagerAnalytics />} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App