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
  const [state, upd] = useState(false);
  const [myFamily, setMyFamily] = useState<Family>(family);
  const [optionPrice, setOptionPrice] = useState<number>(0);
  const [toppingPrice, setToppingPrice] = useState<number>(0);

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  const isWaffles = useMemo(() => family.name === "Waffles", [family.name]);
  const compWidth = (isWaffles) ? "80%" : "";
  const compStyle = isWaffles ? { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' } : {};

  const handleOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  }

  const handleToppings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTopping = event.target.value;
    const index = selectedToppings.indexOf(selectedTopping);
    const topping = myFamily.toppings.find(topping => topping.name === selectedTopping);

    if (index === -1) {
      setSelectedToppings([...selectedToppings, selectedTopping]);
    } else {
      const updatedToppings = selectedToppings.filter((_, i) => i !== index);
      setSelectedToppings(updatedToppings);
    }

    if (topping) {
      setToppingPrice(prevPrice => prevPrice + topping.price * (index === -1 ? 1 : -1));
    } console.log(selectedToppings);
  }

  useEffect(() => {
    setSelectedOption(getSize(myFamily.options[0].name));

  }, []);

  // set price
  useEffect(() => {
    for (let i = 0; i < family.options.length; i++) {
      if (getSize(family.options[i].name) === selectedOption) {
        family.options[i].chosen = true;
        setOptionPrice(family.options[i].price);
      } else {
        family.options[i].chosen = false;
      }
    }

    family.price = +(optionPrice + toppingPrice).toFixed(2);
    setMyFamily(family);
    upd(!state);
  }, [selectedOption, optionPrice, family, toppingPrice]);

  // onClick={() => parentSelected((family.id == hand) ? -1 : myFamily)}>
  return (
    <Paper
      elevation={5 + 15 * Number(family.id == hand)}
      className='itemComp'
      onClick={() => parentSelected(myFamily)}
      style={{ width: compWidth }}
    >
      <div className='name'>{family.name}</div>
      <div className='price'>$ {family.price}</div>

      {/* <img src={assetsDir + "family.name" + ".png"} alt={assetsDir + "unknown.jpg"} className='image' /> */}
      {
        myFamily.description !== "null" && (
          <div className='description'>{myFamily.description}</div>
        )
      }
      {
        myFamily.options.length > 1 ? (
          <FormControl className='options' component='fieldset'>
            <FormLabel component="legend">Options</FormLabel>
            <RadioGroup
              aria-labelledby=""
              name="controlled-radio-buttons-group"
              value={selectedOption}
              onChange={handleOptions}
            >
              {
                myFamily.options.map((option) => (
                  <FormControlLabel
                    control={<Radio />}
                    value={getSize(option.name)}
                    label={`${getSize(option.name)} - ${option.price}`}
                  />
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
            <FormControl component="fieldset" variant="standard" key={myFamily.id}>
              <FormLabel component="legend">Toppings</FormLabel>
              <FormGroup
                aria-label="toppings"
                style={compStyle}
                onChange={handleToppings}
              >
                {
                  myFamily.toppings.map((topping) => (
                    <FormControlLabel
                      control={<Checkbox />}
                      value={topping.name}
                      label={`${topping.name} - ${topping.price}`}
                    />
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