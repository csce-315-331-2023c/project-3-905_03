import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import ItemCard from '../../CashierUI/Components/ItemCard';
import "../../CashierUI/Styles/Cashier.css";
import { FaCheck } from 'react-icons/fa';
import { Order, Item, Topping } from "../../Order.ts";
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";

interface EditOrderModalProps {
    orderID: number;
    closeModal : () => void;
    getOrders: () => void;
}

/**
 * `EditOrderModal` is a React component that displays a modal for editing an order.
 * 
 * @remarks
 * This component displays a form for the user to edit an order's details, including items, toppings, and dine-in/takeout option.
 * The user can add items to the order, remove items from the order, and add toppings to items.
 * The user can also switch between dine-in and takeout.
 * When the form is submitted, the edited order is sent to the server and the modal is closed.
 * 
 * @param orderID - The ID of the order to edit
 * @param closeModal - Function to close the modal
 * @param getOrders - Function to fetch the updated list of orders
 * 
 * @returns The rendered `EditOrderModal` component
 */
const EditOrderModal: React.FC<EditOrderModalProps> = ({ orderID, closeModal, getOrders }) => {
    interface displayItem {
        family_id: number;
        family_name: string;
        family_category: string;
        family_description: string;
    }

    // @ts-ignore
    const [state, upd] = useState(false);
    const [items, setItems] = useState<displayItem[]>([]);
    const [order, setOrder] = useState<Order>(new Order());
    const [rows, setRows] = useState<Item[]>(order.getReceipt());
    const [takeout, setTakeout] = useState<number>(0);
    // @ts-ignore
    const [orderTotal, setOrderTotal] = useState<string | null>(null);
    // @ts-ignore
    const [orderTax, setOrderTax] = useState<string | null>(null);

    const fetchData = (url: string) => {
        axios.get(url)
            .then(res => {
                console.log(res.data);
                const items: displayItem[] = res.data.data.map((itemData: { family_id: number, family_name: string, family_category: string ,family_description: string}, index: number) => {
                    const { family_id, family_name, family_category, family_description } = itemData;
                    return { id: index, family_id: family_id, family_name: family_name, family_category: family_category, family_description: family_description};
                });
                setItems(items);
            })
            .catch(err => console.log(err));
    };

    const fetchOrderInfo = () => {
        axios.post('/editOrderGetInfo', {order_id: orderID})
            .then(res => {
                const data = res.data.data;
                data.total = data.order_total;
                data.tax = 0.07;
                data.receipt = data.receipt.map((item: any) => ({
                    ...data.receipt,
                    id: item.item_id,
                    name: item.served_item,
                    price: item.item_price,
                    toppings: item.toppings.map((topping: any) => ({
                        ...topping,
                        id: topping.topping_id,
                        name: topping.topping,
                        price: topping.topping_price,
                        chosen: true
                    }))
                }));
                const newOrder = new Order(data);
                setOrder(newOrder);
                setRows(newOrder.getReceipt());
                setOrderTotal(newOrder.getOrderTotal());
                setOrderTax(newOrder.getTax());
                upd(a => !a);
                console.log(order.getOrderTotal());
                console.log(order.getTax());
            })
            .catch(err => console.log(err));

    }

    const displayEntrees = () => fetchData('/getEntreeItems');
    const displayWT = () => fetchData('/getW&TItems');
    const displaySides = () => fetchData('/getSideItems');
    const displayDrinks = () => fetchData('/getDrinkItems');
    const displaySpecialItems = () => fetchData('/getSpecialItems');

    const addItemToOrder = (item: Item) => {
        const updatedOrder = order.addItem(item);
        setOrder(updatedOrder);
        setRows(updatedOrder.getReceipt());
        console.log(order.getReceiptString());
        upd(a => !a);
    };

    const deleteItemFromOrder = (item: Item) => {
        const updatedOrder = order.removeItem(item);
        setOrder(updatedOrder);
        setRows(updatedOrder.getReceipt());
        upd(a => !a);
    };

    const submitOrder = async () => {
        axios.post('/editOrderSubmit', {
            order_id: orderID,
            receipt: order.getReceipt(),
            total: order.getOrderTotal(),
            sender_id: order.sender_id,
            dineIn: takeout
          })
        clearOrder();
        getOrders();
        closeModal();

    };

    const takeoutAction = () => {
        if (takeout === 0){
            setOrder(order.setDineIn(true));
        }else{
            setOrder(order.setDineIn(false));
        }
        setRows(order.getReceipt());
        upd(a => !a);
    }

    const clearOrder = () => {
        const newOrder = new Order();
        setOrder(newOrder);
        setRows(newOrder.getReceipt());
        setTakeout(0);
        upd(a => !a);
    }

    const addTopping = (toppings: Topping[], item: Item) => {
        item.toppings = toppings;
        console.log(order.getReceiptString());
    };

    useEffect(() => {
        displayEntrees();
        fetchOrderInfo();
    }, []);

    return (
        <div className="edit-order-modal-container">
                <Container className="cashier-container" style={{ height: '100vh', width: '100%', position: 'relative'}}>
                    <div>
                        <div className="button-container" style={{ display: 'flex', marginTop: '5%'}}>
                            <button className="login-button" onClick={displayEntrees}>Entrees</button>
                            <button className="login-button" onClick={displayWT}>Waffles & Toasts</button>
                            <button className="login-button" onClick={displaySides}>Sides</button>
                            <button className="login-button" onClick={displayDrinks}>Drinks</button>
                            <button className="login-button"onClick={displaySpecialItems}>Special Items</button>
                        </div>
                        <Grid container className="grid-container" style={{ display: 'flex', marginRight: '5%', marginBottom: '5%'}}>
                            {items.map((menuItem) => (
                                <Grid item key={menuItem.family_id} xs={12} md={6} lg={3}>
                                    <ItemCard item={menuItem} addItem={addItemToOrder} addTopping={addTopping}/>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                    <div>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Item ID</th>
                                    <th>Item Name</th>
                                    <th>Add Ons</th>
                                    <th>Price</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.id}</td>
                                        <td>{row.name}</td>
                                        <td>{row.toppings?.filter(topping => topping.chosen).map(topping => topping.name).join(', ')}</td>
                                        <td>{order.getItemPrice(row)}</td>
                                        <td>
                                            <span className="actions">
                                                <IconButton onClick={() => deleteItemFromOrder(row)}>
                                                    <DeleteIcon style={{color: 'white'}}/>
                                                </IconButton>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>Tax: </td>
                                    <td>{order.getTax()}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>Total: </td>
                                    <td>{order.getOrderTotal()}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="button-container" style={{ display: 'flex', width: '110%', marginTop: '3%'}}>
                            <button className="login-button" onClick={() => {submitOrder()}}>Submit New Order</button>
                            <button className="login-button" onClick={() => {setTakeout(takeout === 0 ? 1 : 0); takeoutAction()}}
                                style={{ backgroundColor: takeout === 1 ? 'green' : '#2c5dba' }}>
                                Takeout
                                {takeout === 1 && <span style={{ marginLeft: '10px' }}><FaCheck /></span>}
                            </button>
                            <button className="login-button" onClick={() => clearOrder()}>Clear Order</button>
                            <button className="login-button" onClick={() => closeModal()}>Cancel</button>
                        </div>           
                    </div>
                </Container>
        </div>
    );
};

export default EditOrderModal;
