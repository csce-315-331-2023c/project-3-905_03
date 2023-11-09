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

    const fetchMenuItems = () => {
        axios.get('http://localhost:8080/getServedItems')
            .then(res => {
                const data: Data = res.data;
                setMenuItems(data.data);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    return (
        <div>
            <h1>Cashier</h1>
            <h2>Note 1:</h2>
            <p>
                If you want to keep the Manager and Cashier GUIs consistent with each other and you have not yet implemented the UI yet, u can just use
                - ManagerUI/Pages/Manager.tsx
                - ManagerUI/Components/ManagerNav.tsx
                - ManagerUI/Styles/Manager.css
                - ManagerUI/Styles/ManagerNav.css

                as a template for the Cashier UI
            </p>
            <br></br>
            <h2>Note 2:</h2>
            <p>
                Also feel free to modify anything, but lets try to keep it consistent.

                Gentle reminder:
                - src/styles/App.css
                - src/styles/index.css

                so if you want to change the font or something, you can do it there, and it will apply to all subpages
            </p>
            <Container>
                <Grid container>
                    {
                        menuItems.map((menuItem) => (
                            <Grid item key={menuItem.item_id} xs={12} md={6} lg={4}>
                                <ItemCard item={menuItem}/>
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
        </div>
    );
};

export default Cashier;
