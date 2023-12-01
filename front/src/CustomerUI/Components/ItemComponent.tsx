import React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { Item, Topping, Family } from '../../Order.ts';
import { getSize } from '../../SharedComponents/itemFormattingUtils.ts';

import "../Styles/ItemComponent.css";

import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Paper, FormGroup, Checkbox } from '@mui/material';

import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';


interface Props {
  family: Family;
  key: number;
  hand: number;
  parentSelected: any;
}

const assetsDir = "../../assets/";

export const ItemComponent: React.FC<Props> = ({ family, key, hand, parentSelected }) => {
  const [myFamily, setMyFamily] = useState<Family>(family);

  const handleOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    for (let i = 0; i < family.options.length; i++) {
      if (family.options[i])
        if (getSize(family.options[i].name) === event.target.value) {
          family.options[i].chosen = true;
        } else {
          family.options[i].chosen = false;
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


      {/* <img src={assetsDir + "family.name" + ".png"} alt={assetsDir + "unknown.jpg"} className='image' /> */}
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
      {
        myFamily.toppings.length > 0 ? (
          <div className='toppings'>
            <FormControl  component="fieldset" variant="standard">
              <FormLabel component="legend">Toppings</FormLabel>
              <FormGroup>
                {
                  myFamily.toppings.map((topping, index) => (
                    <FormControlLabel control={<Checkbox />} label={topping.name} />
                  ))
                }
              </FormGroup>
            </FormControl>
          </div>
        ) : (
          <></>
        )
      }
    </Paper>
  );
};