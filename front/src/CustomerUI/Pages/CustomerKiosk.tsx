import React, { useEffect, useState } from 'react';
import axios from 'axios';

import "../Styles/CustomerKiosk.css";
import { Item, Topping, Order, Family } from '../../Order.ts';
import { ItemComponent } from '../Components/ItemComponent';
import { getSize } from '../../SharedComponents/itemFormattingUtils.ts';

import mess from '../../assets/messLogo-cropped.png';
import wafflebite from '../../assets/wafflebite.gif';

import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Switch } from '@mui/material';
import { ShoppingBag, ShoppingBagOutlined, Undo, Add } from '@mui/icons-material';



const Customer = () => {
    const [state, upd] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currOrder, setCurrOrder] = useState<Order>(new Order());

    const [bagView, setBagView] = useState(false);
    const [bag, setBag] = useState<Family[]>([]);

    const [formValue, setFormValue] = useState('w&t');
    const [filters, setFilters] = useState({ gf: false, vegan: false });
    const [fams, setFams] = useState<Family[]>([]);

    const [hand, setHand] = useState(0);
    const [selected, setSelected] = useState<Family | undefined>(undefined);

    const handleSections = (event: React.ChangeEvent<HTMLInputElement>) => {
        // setHand(-1);
        setSelected(undefined);
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
            setSelected({ ...selected, id: selected.id + 1000 });
            setBag([...bag, selected]);
            // setCurrOrder(currOrder.addItem(selected));
            setSelected(undefined);
            upd(a => !a);
        }
    };

    const handleRemove = () => {
        if (selected) {
            //setCurrOrder(currOrder.removeItem(selected));
            upd(a => !a);
        }
    };

    const handleUndo = () => {
        setCurrOrder(currOrder.undo());
        upd(a => !a);
    };

    const handleCheckout = () => {
        //make the order
        fams.forEach((family) => {
            console.log(family);
            const chosenItem = family.options.find((option) => option.chosen === true);
            if (chosenItem) {
                currOrder.receipt.push(chosenItem);
            }
        });

        currOrder.sender_id = 0; // id of logged in user
        currOrder.checkout();
        setCurrOrder(new Order());

        console.log(currOrder.getReceiptString());

        setSelected(undefined);
        upd(a => !a);
    };

    const getFams = async () => {
        try {
            const res = await axios.get('/getFamilyItems');
            const familiesPromises = res.data.data.map(async (familyData: { family_id: number, family_name: string, family_category: string, family_description: string }, index: number) => {
                const { family_id, family_name, family_category, family_description } = familyData;
                const options = await getSizes(family_id);
                const toppings = await getToppings(family_id);
                return {
                    id: family_id,
                    name: family_name,
                    category: family_category,
                    description: family_description,
                    options: options,
                    toppings: toppings,
                    price: 0
                };
            });

            const families = await Promise.all(familiesPromises);
            setFams(families);
        } catch (err) {
            console.log(err);
        }
    };

    const getSizes = async (familyId: number) => {
        try {
            const res = await axios.post('/getServedItemsInFamily', { family_id: familyId });
            const retItems: Item[] = res.data.data.map((itemData: { served_item: string, item_price: number }, index: number) => {
                const { served_item, item_price } = itemData;
                return {
                    id: index,
                    name: served_item,
                    price: item_price
                };
            })
            return retItems;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const getToppings = async (familyId: number) => {
        try {
            const res = await axios.post('/getToppingsInFamily', { family_id: familyId });
            const retToppings: Topping[] = res.data.data.map((toppingData: { topping: string, topping_price: number }, index: number) => {
                const { topping, topping_price } = toppingData;
                return {
                    id: index,
                    name: topping,
                    price: topping_price
                };
            })
            return retToppings;
        } catch (error) {
            console.log(error);
            return [];
        }
    }


    useEffect(() => {
        getFams();
    }, []);

    // loading animation
    useEffect(() => {
        if (fams.length > 0) 
            setLoading(false);        
    }, [fams]);

    useEffect(() => {
        setHand(typeof selected === 'undefined' ? -1 : selected.id);
    }, [selected]);

    // ask krish about loading animation
    const imgClick = () => {
        console.log(fams);
    };

    return (
        <div className='customer'>
            <div className="top">
                <img className='title' src={mess} alt="mess" onClick={imgClick} />
                {bagView ? (
                    <>
                        <div className="bagview">
                            <h1>bagview</h1>
                            <div className='displayedItems'>
                                {bag.map((family, index) => (
                                    <ItemComponent family={family} key={index} hand={hand} parentSelected={setSelected} />
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

            <div className="displayedItems">
                {
                    (!loading) ? (
                        fams
                            .map((family, index) => ({ ...family, index }))
                            .filter((family) => (family.category === formValue))
                            .map((family, index) => (
                                <ItemComponent
                                    family={family}
                                    key={index}
                                    hand={hand}
                                    parentSelected={setSelected}
                                />
                            ))
                    ) : (
                        <img className='loading' src={wafflebite} alt="wafflebite" />
                    )
                }
            </div>
        </div>
    );
};

export default Customer;