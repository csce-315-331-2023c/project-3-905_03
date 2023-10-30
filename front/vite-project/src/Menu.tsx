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
    <>
    </>
  );
};

export default Menu;
