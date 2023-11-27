import React, { useEffect, useState } from 'react';
import axios from 'axios';

import "../Styles/CustomerKiosk.css";
import { Item, Order } from '../../Order.ts';
import { ItemComponent } from '../Components/ItemComponent';

import mess from '../../assets/messLogo-cropped.png';

import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Switch, Paper } from '@mui/material';
import { ShoppingBag, ShoppingBagOutlined, Undo, Add } from '@mui/icons-material';

const Customer = () => {
    const [state, upd] = useState(false);
    const [currOrder, setCurrOrder] = useState<Order>(new Order());

    const [bagView, setBagView] = useState(false);
    const [items, setItems] = useState<Item[]>([]);
    const [formValue, setFormValue] = useState('w&t');
    const [filters, setFilters] = useState({ gf: false, vegan: false });

    const [hand, setHand] = useState(0);
    const [selected, setSelected] = useState<Item | undefined>(undefined);

    const handleSections = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHand(-1);
        setFormValue(event.target.value);
    };

    const handleFilters = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, [event.target.name]: event.target.checked });
    };

    const handleDineIn = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrOrder(currOrder.setDineIn(event.target.value === 'dine-in'));
        upd(a => !a);
    };

    const handleAdd = () => {
        if (selected) {
            setCurrOrder(currOrder.addItem(selected));
            upd(a => !a);
        }
    }

    const handleRemove = () => {
        if (selected) {
            setCurrOrder(currOrder.removeItem(selected));
            upd(a => !a);
        }
    }

    const handleUndo = () => {
        setCurrOrder(currOrder.undo());
        upd(a => !a);
    };

    const handleCheckout = () => {
        // id of logged in user
        currOrder.sender_id = 0;
        currOrder.checkout();
        setCurrOrder(new Order());

        console.log(currOrder.getReceiptString());

        setSelected(undefined);
        upd(a => !a);
    };

    const getItems = async () => {
        axios.get('/getServedItemsFamily')
            .then((res) => {
                console.log(res.data);
                const items: Item[] = res.data.data.map((itemData: { served_item: string, item_price: number/*, item_category: string*/ }, index: number) => {
                    const { served_item, item_price/*, item_category*/ } = itemData;
                    return { id: index, name: served_item, price: item_price/*, category: item_category*/ };
                });
                setItems(items);
                console.log("items");
                console.log(items);
            })
            .catch((error) => {
                console.log(error);
            });

        // for (let i = 0; i < items.length; i++) {
        //     axios.post('/getServedItemsInFamily' items[i].family_id)
        // }
    };

    useEffect(() => {
        getItems();
    }, []);

    useEffect(() => {
        setHand(typeof selected === 'undefined' ? -1 : selected.id);
    }, [selected]);

    // ask krish about loading animation

    return (
        <>
            <div>-</div>
            <div className="top">
                <img className='title' src={mess} alt="mess" />
                {bagView ? (
                    <>

                        <div className="bagview">
                            <h1>bagview</h1>
                            <div className='displayedItems'>
                                {currOrder.receipt.map((item, index) => (
                                    <ItemComponent item={item} key={index} hand={hand} parentSelected={setSelected} />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <FormControl className='sections' component='fieldset'>
                            <FormLabel component="legend">Sections</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={formValue}
                                defaultValue="w&t"
                                onChange={handleSections}
                            >
                                <FormControlLabel value="w&t" control={<Radio />} label="Waffles & Toast" />
                                <FormControlLabel value="entree" control={<Radio />} label="Entrees" />
                                <FormControlLabel value="side" control={<Radio />} label="Sides" />
                                <FormControlLabel value="drink" control={<Radio />} label="Drinks" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl className='filters'>
                            <FormLabel id="demo-controlled-radio-buttons-group">Filters</FormLabel>
                            <FormControlLabel
                                control={<Switch name="gf" onChange={handleFilters} />}
                                label="Gluten Free"
                            />
                            <FormControlLabel
                                control={<Switch name="vegan" onChange={handleFilters} />}
                                label="Vegan"
                            />
                        </FormControl>
                    </>
                )}
                {/* <IconButton className="bg" onClick={() => setBagView(!bagView)}>
                    {bagView ? (
                        <ShoppingBag />
                    ) : (
                        <ShoppingBagOutlined />
                    )}
                    {currOrder.receipt.length}
                </IconButton> */}
                {/* <IconButton className="undo" onClick={() => handleUndo()}>
                    <Undo />
                </IconButton>
                <IconButton className="add" onClick={() => handleAdd()}>
                    <Add />
                </IconButton> */}
                <Button className='bag' variant="outlined" onClick={() => setBagView(!bagView)}
                    startIcon=
                    {
                        bagView ? (
                            <ShoppingBag />
                        ) : (
                            <ShoppingBagOutlined />
                        )
                    }
                >
                    {currOrder.receipt.length} items
                </Button>
                <Button className='undo' variant="outlined" startIcon={<Undo />} onClick={() => handleUndo()}>
                    Undo
                </Button>
                <Button className='add' variant="outlined" startIcon={<Add />} onClick={() => handleAdd()}>
                    Add
                </Button>
                <FormControl className='dinein' component='fieldset'>
                    <FormLabel component="legend">Seating</FormLabel>
                    <RadioGroup
                        aria-label="dine-in-or-take-out"
                        name="dine-in-or-take-out"
                        defaultValue="dine-in"
                        value={currOrder.dineIn ? 'dine-in' : 'take-out'}
                        onChange={handleDineIn}
                    >
                        <FormControlLabel value="dine-in" control={<Radio />} label="Dine-in" />
                        <FormControlLabel value="take-out" control={<Radio />} label="Take-out" />
                    </RadioGroup>
                </FormControl>
                <Button className='checkout' variant="contained" onClick={() => handleCheckout()}>
                    Checkout
                </Button>
            </div>
            <div className='sectionDisplay'>
                <div className="displayedItems">
                    <div>hand: {hand}</div>
                    {items
                        // .map((item, index) => ({ ...item, index }))
                        // .filter((item) => item.category === formvalue)
                        .map((item, index) => (
                            <ItemComponent
                                item={item}
                                key={index}
                                hand={hand}
                                parentSelected={setSelected}
                            />
                        ))}
                </div>
            </div>
        </>
    );
};

export default Customer;