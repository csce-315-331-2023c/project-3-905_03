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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMyFamily({ ...myFamily, option: event.target.value });
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
      <FormControl className='options' component='fieldset'>
        <FormLabel component="legend">Options</FormLabel>
        <RadioGroup
          aria-labelledby=""
          name="controlled-radio-buttons-group"
          value={myFamily.option}
          onChange={handleOptions}
        >
          {
            myFamily.options.map((option: Item, index: number) => (
              <FormControlLabel key={index} value={option} control={<Radio />} label={getSize(option.name)} />
            ))
          }
        </RadioGroup>
      </FormControl>
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