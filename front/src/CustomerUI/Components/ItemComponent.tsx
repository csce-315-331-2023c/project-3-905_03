import React from 'react';
import { useEffect, useState } from 'react'; 
import { Item } from '../../Order.ts';

import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';


interface Props {
  item: Item;        
  key: number;
  hand: number;
  parentSelected: any;
}

export const ItemComponent: React.FC<Props> = ({ item, key, hand, parentSelected }) => {
  const [myItem, setMyItem] = useState<Item>(item);

  return (
      <div style={{ border: item.id==hand ? '3px solid black' : '1px solid black', padding: '10px', margin: '10px', display: 'inline-block' }} onClick={() => parentSelected(myItem)}>
          <div>Name: {item.name}</div>
          <div>Price: {item.price}</div>
          <div>Description: {item.description}</div>
          <div>Category: {item.category}</div>
      </div>
  );
};