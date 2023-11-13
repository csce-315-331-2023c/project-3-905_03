import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Item } from '../../Order.ts';
import "../Styles/CustomerKiosk.css";

import { ItemComponent } from '../Components/ItemComponent';

import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Stack, Button, IconButton } from '@mui/material';
import { ShoppingBag, ShoppingBagOutlined, Undo, Add, LocalFireDepartment } from '@mui/icons-material';

const Customer = () => {
    const [bagView, setBagView] = useState(false);
    const [items, setItems] = useState<Item[]>([]);
    const [formvalue, setFormValue] = React.useState('w&t');
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
        // show snackbar or popup
        // print receipt with order number
    };

    const getItems = async () => {
        axios.get('/getServedItems')
            .then((res) => {
                console.log(res.data);
                const items: Item[] = res.data.data.map((itemData: { served_item: string, item_price: number, item_category: string }, index: number) => {
                    const { served_item, item_price, item_category } = itemData;
                    return { id: index, name: served_item, price: item_price, category: item_category };
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
        console.log("<");
        console.log(selected);
        console.log(hand);
        console.log(">");

        setHand(typeof selected === 'undefined' ? -1 : selected.id);
    }, [selected, hand]);


    // ask krish about loading animation

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
                                defaultValue="w&t"
                                onChange={handleSections}
                            >
                                <FormControlLabel value="w&t" control={<Radio />} label="Waffles & French Toast" />
                                <FormControlLabel value="entree" control={<Radio />} label="Entrees" />
                                <FormControlLabel value="side" control={<Radio />} label="Sides" />
                                <FormControlLabel value="drink" control={<Radio />} label="Drinks" />
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
                {items
                    .map((item, index) => ({ ...item, index }))
                    .filter((item) => item.category === formvalue)
                    .map((item, index) => (
                        <ItemComponent
                            item={item}
                            key={item.index}
                            hand={hand}
                            parentSelected={setSelected}
                        />
                ))}
            </div>
        </>
    );
};

export default Customer;