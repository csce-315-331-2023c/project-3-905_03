import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import ItemCard from '../Components/ItemCard';
import "../Styles/Cashier.css";
import { dropLastWord } from "../../SharedComponents/itemFormattingUtils";
import { FaCheck } from 'react-icons/fa';
import { Order, Item } from "../../Order.ts";
import { BsFillTrashFill } from "react-icons/bs";

const Cashier = () => {
    interface displayItem {
        family_id: number;
        family_name: string;
        family_category: string;
        family_description: string;
    }

    const [state, upd] = useState(false);
    const [items, setItems] = useState<displayItem[]>([]);
    const [order, setOrder] = useState<Order>(new Order());
    const [rows, setRows] = useState<Item[]>(order.getReceipt());
    const [takeout, setTakeout] = useState<number>(0);
    const [split, setSplit] = useState<number>(0);

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

    const displayEntrees = () => fetchData('/getEntreeItems');
    const displayWT = () => fetchData('/getW&TItems');
    const displaySides = () => fetchData('/getSideItems');
    const displayDrinks = () => fetchData('/getDrinkItems');
    const displaySpecialItems = () => fetchData('/getSpecialItems');

    const addItemToOrder = (item: Item) => {
        setOrder(order.addItem(item));
        setRows(order.getReceipt());
        upd(a => !a);
    };

    const deleteItemFromOrder = (item: Item) => {
        setOrder(order.removeItem(item));
        setRows(order.getReceipt());
        upd(a => !a);
    };

    const submitOrder = () => {
        // axios.post('/submitOrder', {
        //     order: order.getReceipt(),
        //     takeout: takeout,
        //     split: split
        // })
        //     .then(res => {
        //         console.log(res);
        //     })
        //     .catch(err => console.log(err));
    };

    useEffect(() => {
        displayEntrees();
    }, []);

    return (
        <Container style={{ height: '100vh', width: '100%' }}>
            <div className="button-container">
                <button onClick={displayEntrees}>Entrees</button>
                <button onClick={displayWT}>Waffles & Toasts</button>
                <button onClick={displaySides}>Sides</button>
                <button onClick={displayDrinks}>Drinks</button>
                <button onClick={displaySpecialItems}>Special Items</button>
            </div>
            <Grid container>
                {items.map((menuItem) => (
                    <Grid item key={menuItem.family_id} xs={12} md={6} lg={3}>
                        <ItemCard item={menuItem} addItem={addItemToOrder} />
                    </Grid>
                ))}
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
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.id}</td>
                            <td>{row.name}</td>
                            <td>{row.price}</td>
                            <td>
                                <span className="actions">
                                    <BsFillTrashFill onClick={() => deleteItemFromOrder(row)} />
                                </span>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Total: </td>
                        <td>{split === 0 ? order.getOrderTotal() : order.splitOrder()}</td>
                    </tr>
                </tbody>
            </table>
            <div className="button-container">
                <button onClick={submitOrder}>Submit Order</button>
                <button onClick={() => setTakeout(takeout === 0 ? 1 : 0)}
                    style={{ backgroundColor: takeout === 1 ? 'green' : '#1a1a1a' }}>
                    Takeout
                    {takeout === 1 && <span style={{ marginLeft: '10px' }}><FaCheck /></span>}
                </button>
                <button onClick={() => setSplit(split === 0 ? 1 : 0)}
                    style={{ backgroundColor: split === 1 ? 'green' : '#1a1a1a' }}>
                    Split
                    {split === 1 && <span style={{ marginLeft: '10px' }}><FaCheck /></span>}
                </button>
            </div>
        </Container>
    );
};

export default Cashier;
