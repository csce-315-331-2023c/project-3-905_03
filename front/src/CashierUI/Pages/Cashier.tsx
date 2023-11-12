import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Container } from "@material-ui/core";
import ItemCard from '../Components/ItemCard';
import "../Styles/Cashier.css";
import { dropLastWord } from "../../SharedComponents/itemFormattingUtils";
import { BsFillPlusCircleFill, BsFillTrashFill} from 'react-icons/bs';
import { AiFillMinusCircle } from 'react-icons/ai';
import { Order } from "../../Order.ts";

const Cashier = () => {
    interface menuItem {
        item_id: number;
        served_item: string;
        item_price: number;
    }

    interface Data {
        data: menuItem[];
    }

    interface Item {
        id: number;
        name: string;
        price: number;
        quantity: number;
    }

    const [menuItems, setMenuItems] = useState<menuItem[]>([]);
    const [order, setOrder] = useState<Order>(new Order());
    const [rows, setRows] = useState<Item[]>(order.getReceipt2());

    const displayEntrees = () => {
        axios.get('http://localhost:8080/getEntreeItems')
            .then(res => {
                const data: Data = res.data;
                const modifiedData = data.data.map(item => ({
                    ...item,
                    served_item: dropLastWord(item.served_item)
                }));
                const uniqueItemsMap = new Map(modifiedData.map(item => [item.served_item, item]));
                setMenuItems(Array.from(uniqueItemsMap.values()));
            })
    }

    const displaySides = () => {
        axios.get('http://localhost:8080/getSideItems')
            .then(res => {
                const data: Data = res.data;
                setMenuItems(data.data);
            })
            .catch(err => console.log(err));
    }

    const displayDrinks = () => {
        axios.get('http://localhost:8080/getDrinkItems')
            .then(res => {
                const data: Data = res.data;
                setMenuItems(data.data);
            })
            .catch(err => console.log(err));
    }

    const displaySpecialItems = () => {
        axios.get('http://localhost:8080/getSeasonalItems')
            .then(res => {
                const data: Data = res.data;
                setMenuItems(data.data);
            })
            .catch(err => console.log(err));
    }

    const addItemToOrder = (id: number, name: string, price: number, quantity: number) => {
        const tempOrder = new Order();
        order.addItem(id, name, price, quantity);
        tempOrder.setReceipt(order.getReceipt2());
        setOrder(tempOrder);
        setRows(tempOrder.getReceipt2());
    };
    
    const removeItemFromOrder = (id: number) => {
        const tempOrder = new Order();
        order.removeItem(id);
        tempOrder.setReceipt(order.getReceipt2());
        setOrder(tempOrder);
        setRows(tempOrder.getReceipt2());
    };

    const deleteItemFromOrder = (id: number) => {
        const tempOrder = new Order();
        order.deleteItem(id);
        tempOrder.setReceipt(order.getReceipt2());
        setOrder(tempOrder);
        setRows(tempOrder.getReceipt2());
    };

    useEffect(() => {
        displayEntrees();
    }, []);

    return (
        <Container style={{ height: '100vh', width: '100%'}}>
            <div className="button-container">
                <button onClick={displayEntrees}>Entrees</button>
                <button onClick={displaySides}>Sides</button>
                <button onClick={displayDrinks}>Drinks</button>
                <button onClick={displaySpecialItems}>Special Items</button>
            </div>
            <Grid container >
                {
                    menuItems.map((menuItem) => (
                        <Grid item key={menuItem.item_id} xs={12} md={6} lg={3}>
                            <ItemCard item={menuItem} addItem={addItemToOrder}/>
                        </Grid>
                    ))
                }
            </Grid>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {   rows.length === 0 ? 
                        <tr>
                            <td></td>
                            <td></td>
                            <td>Waiting For Order...</td>
                            <td></td>
                        </tr>
                        :
                        rows.map((row, index) => (
                            <tr key={index}>
                                <td>{row.id}</td>
                                <td>{row.name}</td>
                                <td>{row.price}</td>
                                <td>
                                    <span className="actions">
                                        <BsFillPlusCircleFill onClick={() => addItemToOrder(row.id, row.name, row.price, 1)} />
                                        {row.quantity}
                                        <AiFillMinusCircle onClick={() => removeItemFromOrder(row.id)} />
                                        <BsFillTrashFill onClick={() => deleteItemFromOrder(row.id)} /> 
                                    </span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </Container>
    );
};

export default Cashier;
