import React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { Item, Topping, Family } from '../../Order.ts';
import { getSize } from '../../SharedComponents/itemFormattingUtils.ts';

import "../Styles/ItemComponent.css";

import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Paper } from '@mui/material';

import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';


interface Props {
  family: Family;
  key: number;
  hand: number;
  parentSelected: any;
}

export const ItemComponent: React.FC<Props> = ({ family, key, hand, parentSelected }) => {
  const [myFamily, setMyFamily] = useState<Family>(family);

  const handleOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    for (let i = 0; i < family.options.length; i++) {
      if (family.options[i])
        if (getSize(family.options[i].name) === event.target.value) {
          family.options[i].selected = true;
        } else {
          family.options[i].selected = false;
        }
    }
    setMyFamily(family);
  }

  // onClick={() => parentSelected((family.id == hand) ? -1 : myFamily)}>
  return (
    <Paper
      elevation={3 + 10 * Number(family.id == hand)}
      className='itemComp'
      onClick={() => parentSelected(myFamily)}>
      <div className='name'>{family.name}</div>
      <div className='price'>$ {family.price}</div>

      {/* <div className='description'>Description: {myFamily.description}</div> */}
      {
        myFamily.options.length > 1 ? (
          <FormControl className='options' component='fieldset'>
            <FormLabel component="legend">Options</FormLabel>
            <RadioGroup
              aria-labelledby=""
              name="controlled-radio-buttons-group"
              // value={getSize(myFamily.options[0])}
              onChange={handleOptions}
            >
              {
                myFamily.options.map((option: Item, index: number) => (
                  <FormControlLabel key={index} value={getSize(option.name)} control={<Radio />} label={getSize(option.name)} />
                ))
              }
            </RadioGroup>
          </FormControl>
        ) : (
          <div className='options'>
            {getSize(myFamily.options[0].name)}
          </div>
        )
      }
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
    </Paper>
  );
};