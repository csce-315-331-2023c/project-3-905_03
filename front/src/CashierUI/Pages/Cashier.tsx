import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Container } from "@material-ui/core";
import ItemCard from '../Components/ItemCard';
import "../Styles/Cashier.css";

const Cashier = () => {
    interface menuItem {
        item_id: number;
        served_item: string;
        item_price: number;
    }

    interface Data {
        data: menuItem[];
    }

    const [menuItems, setMenuItems] = useState<menuItem[]>([]);

    const displayEntrees = () => {
        axios.get('http://localhost:8080/getEntreeItems')
            .then(res => {
                const data: Data = res.data;
                setMenuItems(data.data);
            })
            .catch(err => console.log(err));
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
                            <ItemCard item={menuItem}/>
                        </Grid>
                    ))
                }
            </Grid>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th className='expand'>Item Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
            </table>
        </Container>
    );
};

export default Cashier;
