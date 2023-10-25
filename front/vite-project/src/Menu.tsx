import React from 'react';

interface MenuItem {
  name: string;
  link: string;
}

interface MenuProps {
  items: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ items }) => {
  return (
    <nav>
      <ul>
        {items.map((item) => (
          <li key={item.link}>
            <a href={item.link}>{item.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
