import React, { useEffect, useState } from 'react';
import axios from 'axios';

import "../Styles/CustomerKiosk.css";
import { Item, Topping, Order, Family } from '../../Order.ts';
import { ItemComponent } from '../Components/ItemComponent';
import { Translate } from '../../SharedComponents/Translate.tsx';

import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import HomeIcon from '@mui/icons-material/Home';
import FormatColorResetIcon from '@mui/icons-material/FormatColorReset';
import { useNavigate } from 'react-router-dom';

import wafflebite from '../../assets/wafflebite.gif';

import {
    Radio, RadioGroup,
    FormControlLabel, FormControl, FormLabel,
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Slide, Avatar
} from '@mui/material';
import {
    ShoppingBag, ShoppingBagOutlined,
    Remove, Undo, Add
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';

/**
 * `Customer` is a React component that represents the customer kiosk interface.
 * 
 * @remarks
 * This component manages the state of the customer's order, including the selected items, the total price, and the checkout process.
 * It also handles the display of the interface, including the item selection, the shopping bag, and the checkout dialog.
 * 
 * @returns The rendered `Customer` component
 */
const Customer = () => {
    // @ts-ignore
    const [state, upd] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isClicked, setIsClicked] = useState(false);

    const [currOrder, setCurrOrder] = useState<Order>(new Order());
    const [orderId, setOrderId] = useState<number>(0);


    const [bagView, setBagView] = useState(false);
    const [bag, setBag] = useState<Family[]>([]);
    const [bagTotal, setBagTotal] = useState<string>("");

    const [formValue, setFormValue] = useState('w&t');
    const [fams, setFams] = useState<Family[]>([]);

    const [hand, setHand] = useState(0);
    const [selected, setSelected] = useState<Family | undefined>(undefined);


    const handleClose = () => {
        setOrderId(0);
        window.location.reload();
        // logout !!
    };

    const handleSections = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(undefined);
        setFormValue(event.target.value);
    };

    const handleDineIn = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrOrder(currOrder.setDineIn(event.target.value === 'dine-in'));
        upd(a => !a);
    };

    const handleAdd = () => {
        if (selected) {
            console.log("selected", selected);
            setSelected({ ...selected, id: selected.id + 1000 });
            setBag([...bag, selected]);
            setSelected(undefined);
            upd(a => !a);
        }
    };

    const handleRemove = () => {
        if (selected) {
            setBag(bag.filter((family) => family !== selected));
            setSelected(undefined);
            upd(a => !a);
        }
    };

    const handleUndo = () => {
        setBag(bag.slice(0, bag.length - 1));
        upd(a => !a);
    };

    const handleCheckout = async () => {
        if (bag.length > 0 && confirm("Want to confirm your checkout? (payment options)") == true) {//make the order
            console.log("bag", bag)
            bag.forEach((family) => {
                const chosenItem = family.options.find((option) => option.chosen === true);
                console.log("ID", chosenItem?.id);
                console.log("toppings", family?.toppings);
                if (chosenItem)
                    currOrder.addItem({ ...chosenItem, toppings: family.toppings });
            });

            currOrder.sender_id = 0; // id of logged in user
            const order = await currOrder.checkout();
            setOrderId(order);
            console.log("order", order);
        }
    };

    const getTotal = () => {
        let total = 0;
        bag.forEach((family) => {
            total += family.price;
        });
        return total.toFixed(2);
    };

    const getFams = async () => {
        try {
            const res = await axios.get('/getFamilyItems');
            // @ts-ignore
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
            console.log(families);
        } catch (err) {
            console.log(err);
        }
    };

    const getSizes = async (familyId: number) => {
        try {
            const res = await axios.post('/getServedItemsInFamily', { family_id: familyId });
            // @ts-ignore
            const retItems: Item[] = res.data.data.map((itemData: { served_item: string, item_price: number, item_id: number }, index: number) => {
                const { served_item, item_price, item_id } = itemData;
                return {
                    id: item_id,
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

    const Transition = React.forwardRef(function Transition(
        props: TransitionProps & {
            children: React.ReactElement<any, any>;
        },
        ref: React.Ref<unknown>,
    ) {
        return <Slide direction="up" ref={ref} {...props} />;
    });


    useEffect(() => {
        getFams();
        // sign in pop up
    }, []);

    // loading animation
    useEffect(() => {
        if (fams.length > 0)
            setLoading(false);
    }, [fams]);

    useEffect(() => {
        setHand(typeof selected === 'undefined' ? -1 : selected.id);
    }, [selected]);

    useEffect(() => {
        setBagTotal(getTotal());
        upd(a => !a);
    }, [bag, isClicked]);

    const [zoomFactor, setZoomFactor] = useState(1);

    const handleZoomIn = () => {
        const newZoomFactor = zoomFactor + 0.1;
        setZoomFactor(newZoomFactor);
        (document.body.style as any).zoom = `${newZoomFactor}`;
    };

    const handleZoomOut = () => {
        const newZoomFactor = zoomFactor > 1 ? zoomFactor - 0.1 : 1;
        setZoomFactor(newZoomFactor);
        (document.body.style as any).zoom = `${newZoomFactor}`;
    };

    const [isGrayscale, setIsGrayscale] = useState(false);

    const handleColorReset = () => {
        setIsGrayscale(!isGrayscale);
    };

    useEffect(() => {
        document.body.style.filter = isGrayscale ? 'grayscale(100%) contrast(1.25)' : 'none';
    }, [isGrayscale]);

    const navigate = useNavigate();

    const handleAccessLogin = () => {
        navigate('/');
    }

    return (
        <div className='customer'>

            <div className='customer-header'>
                <button onClick={handleAccessLogin}><HomeIcon className="header-icon" /></button>
                <div className="header-icon" id='translate'><Translate /></div>
                <button onClick={handleColorReset}><FormatColorResetIcon className="header-icon" /></button>
                {/* <button><TranslateIcon className="header-icon"/></button> */}

                <button onClick={handleZoomOut}><ZoomOutIcon className="header-icon" /></button>
                <button onClick={handleZoomIn}><ZoomInIcon className="header-icon" /></button>
                <button ><Avatar id='avatar' className="header-icon" alt="" src="" /></button>
            </div>
            <div className="top">

                <FormControl className='sections' component='fieldset'>
                    <FormLabel className='sectionsLabel' component="legend">Sections</FormLabel>
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
                        <FormControlLabel value="special" control={<Radio />} label="Specials" />
                    </RadioGroup>
                </FormControl>
                <div className='total'>Total: ${bagTotal}</div>

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
                    {bag.length} items
                </Button>
                <Button className='remove' variant="outlined" startIcon={<Remove />} onClick={() => handleRemove()}>
                    Remove
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
            <div className="displayWrap">
                <div className="displayedItems" onClick={() => setIsClicked(!isClicked)}>
                    {
                        (!loading) ? (
                            bagView ? (
                                bag
                                    .map((family) => (
                                        <ItemComponent
                                            family={family}
                                            key={family.name}
                                            hand={hand}
                                            parentSelected={setSelected}
                                        />
                                    ))
                            ) :
                                fams
                                    .filter((family) => (family.category === formValue))
                                    .map((family) => (
                                        <ItemComponent
                                            family={family}
                                            key={family.name}
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

            <Dialog
                open={orderId !== 0}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle> Your order number is <b>{orderId}</b>.</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Your order has been placed!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
export default Customer;