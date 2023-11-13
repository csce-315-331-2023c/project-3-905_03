import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Item } from '../../Order.ts';
import "../Styles/Customer.css";

import { ItemComponent } from '../Components/ItemComponent';

import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Stack, Button, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
import { ShoppingBag, ShoppingBagOutlined, Undo, Add, LocalFireDepartment } from '@mui/icons-material';

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

    const handleCheckout = () => {
        setBag([]);
        setSelected(undefined);
    };

    const getItems = async () => {
        axios.get('/getServedItems')
            .then((res) => {
                const items: Item[] = res.data.data.map((itemData: { served_item: string, item_price: number }, index: number) => {
                    const { served_item, item_price } = itemData;
                    return { id: index, name: served_item, price: item_price };
                });
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
        console.log("selected");
        console.log(selected);
        
        setHand(typeof selected === 'undefined' ? -1 : selected.id);
        console.log("hand");
        console.log(hand);
    }, [selected, hand]);



    return (
        <>
            <h1>Customer</h1>
            <div className="top">
                {bagView ? (
                    <>
                        <h1>bagview</h1>
                        <div className="displayedItems">
                            {bag.map((item, index) => (
                                <ItemComponent item={item} key={index} hand={hand} parentSelected={setSelected} />
                            ))}
                        </div>
                    </>
                ) : (
                    <>
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
                    </>
                )}
                <div className="bag-controls">
                    <Stack spacing={2} direction="column">
                        <IconButton className="control" onClick={() => setBagView(!bagView)}>
                            {bagView ? (
                                <ShoppingBag />
                            ) : (
                                <ShoppingBagOutlined />
                            )}
                            {bag.length}
                        </IconButton>
                        <IconButton className="control" onClick={() => setBag(bag.slice(0, -1))}>
                            <Undo />
                        </IconButton>
                        <IconButton className="control" onClick={() => handleAdd()}>
                            <Add />
                        </IconButton>
                        <Button variant="contained" onClick={() => handleCheckout()}>
                            Checkout
                        </Button>
                    </Stack>
                </div>
            </div>

            <div className="displayedItems">
                {items.map((item, index) => (
                    <ItemComponent item={item} key={index} hand={hand} parentSelected={setSelected} />
                ))}
            </div>
        </>
    );
};

export default Customer;