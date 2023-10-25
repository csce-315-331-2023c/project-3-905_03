import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from './Menu'
import Manager from './Manager'

interface Props {
  name: string;
  age: number;
  employees: string[];
}

function App() {
  const [name, setName] = useState('John')
  const [age, setAge] = useState(30)
  const [employees, setEmployees] = useState(['Alice', 'Bob', 'Charlie'])

  const menuItems: MenuItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Manager', link: '/manager' },
  ];

  return (
    <>
      <BrowserRouter>
        <Menu items={menuItems} />
        <Routes>
          <Route path="/manager" element={<Manager name={name} age={age} employees={employees} />} />
          <Route path="/" element={/<Login />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App