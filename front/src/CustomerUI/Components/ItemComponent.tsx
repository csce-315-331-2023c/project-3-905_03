import React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { Item } from '../../Order.ts';
import "../Styles/ItemComponent.css";

import { Paper } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';


interface Props {
  item: Item;
  key: number;
  hand: number;
  parentSelected: any;
}

export const ItemComponent: React.FC<Props> = ({ item, key, hand, parentSelected }) => {
  const [myItem, setMyItem] = useState<Item>(item);
  const [myWidth, setMyWidth] = useState<number>(200);
  const [myHeight, setMyHeight] = useState<number>(100);

  const baseStyle = useMemo(() => ({
    width: `${myWidth}px`,
    height: `${myHeight}px`,
    backgroundColor: 'lightblue',
    color: 'white',
    fontWeight: 'bold',
    padding: '10px',
    margin: '10px',
    display: 'inline-block',
  }), [myWidth, myHeight]);

  const [itemStyle, setItemStyle] = useState({});

  useEffect(() => {
    setMyItem(item);
  }, [baseStyle, hand, item]);
  
  return (
    <Paper elevation={3 + 10 * Number(item.id == hand)} className='item' style={itemStyle} onClick={() => parentSelected(myItem)}>
      {/* <div className='item' style={itemStyle} onClick={() => parentSelected(myItem)}> */}
        <div className='name'>{item.name}</div>
        <div className='price'>$ {item.price}</div>
        
        {/* <div className='description'>Description: {item.description}</div> */}
        {/* options */}
        {/* <div className='toppings'>
          {
            item.toppings.map((topping, index) => (
              <>
                <div className='toppingName' key={index}>{topping.name}</div>
                <div className='toppingPrice' key={index}>{topping.price}</div>
              </>
            ))
          }
        </div> */}
      {/* </div> */}
    </Paper>
  );
};