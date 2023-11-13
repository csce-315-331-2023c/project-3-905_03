import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { Item } from '../../Order.ts';
import Button from '@mui/material/Button';
import "../Styles/Customer.css";

import { ItemComponent } from '../Components/ItemComponent';

import gluten from '../../assets/gluten-free.png';
import vegan from '../../assets/vegan.png';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { IconButton } from '@mui/material';

import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import UndoIcon from '@mui/icons-material/Undo';
import AddIcon from '@mui/icons-material/Add';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const Customer = () => {
    const [bagView, setBagView] = useState(false);
    const [items, setItems] = useState<Item[]>([]);
    const [formvalue, setFormValue] = React.useState('waffles');
    const [formats, setFormats] = React.useState(() => ['bold', 'italic']);
    const [bag, setBag] = useState<Item[]>([]);
    const [hand, setHand] = useState(0);
    const [selected, setSelected] = useState<Item | undefined>(undefined);

    const handleFormat = (
        event: React.MouseEvent<HTMLElement>,
        newFormats: string[],
    ) => {
        setFormats(newFormats);
    };

    const handleSections = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValue(event.target.value);
    };

    const handleAdd = () => {
        if (selected) {
            setBag([...bag, selected]);
        }
    }

    const handleItemClick = (item: Item) => {
        console.log(item);
        console.log("please work");
        setSelected(item);
    };

    const handleCheckout = () => {
        setBag([]);
        setSelected(undefined);
    };

    const getItems = async () => {
        axios.get('/getServedItems')
            .then((res) => {
                console.log(res.data.data);
                const items: Item[] = res.data.data.map((itemData: { served_item: string, item_price: number }, index: number) => {
                    const { served_item, item_price } = itemData;
                    return { id: index, name: served_item, price: item_price };
                });
                console.log(items);
                setItems(items);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getItems();
    }, []);

    useEffect(() => {
        console.log(selected);
        setHand(selected?.id || -1);
    }, [selected]);

    

    return (
        <>
            <h1>Customer</h1>
            <div className="top">
                {bagView ? (
                    <h1>bagview</h1>
                ) : (
                    <div>
                        <FormControl className='sections'>
                            <FormLabel id="demo-controlled-radio-buttons-group">Sections</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={formvalue}
                                onChange={handleSections}
                            >
                                <FormControlLabel value="wafflesandtoast" control={<Radio />} label="Waffles & French Toast" />
                                <FormControlLabel value="entrees" control={<Radio />} label="Entrees" />
                                <FormControlLabel value="sides" control={<Radio />} label="Sides" />
                                <FormControlLabel value="drinks" control={<Radio />} label="Drinks" />
                            </RadioGroup>
                        </FormControl>

                        <ToggleButtonGroup
                            value={formats}
                            onChange={handleFormat}
                            aria-label="text formatting"
                        >
                            <ToggleButton value="bold" aria-label="bold">
                                <img src={gluten} alt="gluten-free" />
                            </ToggleButton>
                            <ToggleButton value="italic" aria-label="italic">
                                <img src={vegan} alt="vegan" />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                )}
                <div className="bag-controls">
                    <Stack spacing={2} direction="column">
                        <IconButton className="control" onClick={() => setBagView(!bagView)}>
                            {bagView ? (
                                <ShoppingBagIcon />
                            ) : (
                                <ShoppingBagOutlinedIcon />
                            )}
                            {bag.length}
                        </IconButton>
                        <IconButton className="control" onClick={() => setBag(bag.slice(0, -1))}>
                            <UndoIcon />
                        </IconButton>
                        <IconButton className="control" onClick={() => handleAdd()}>
                            <AddIcon />
                        </IconButton>
                        <Button variant="contained" onClick={() => handleCheckout}>
                            Checkout
                        </Button>
                    </Stack>
                </div>
            </div>

            <div className="displayedItems">
                {items.map((item, index) => (
                    <ItemComponent item={item} key={index} hand={hand} setSelected={setSelected} />
                ))}
            </div>
        </>
    );
};

export default Customer;