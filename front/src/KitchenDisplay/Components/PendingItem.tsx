import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/KitchenDisplay.css';
import {formatCamelCase} from '../../SharedComponents/itemFormattingUtils.ts';

interface OrderProps {
    item: {
        order_item_id: number;
        order_id: number;
        item_id: number;
    };
}

/**
 * `PendingOrder` is a React component that displays a pending order.
 * 
 * @remarks
 * This component fetches the served item and its toppings from the server, stores them in the state, and displays them.
 * The served item and its toppings are fetched when the component mounts.
 * 
 * @param props - The properties passed to the component, including the item
 * 
 * @returns The rendered `PendingOrder` component
 */
const PendingOrder: React.FC<OrderProps> = (props) => {
    interface servedItemRow {
        item_id: number;
        served_item: string;
        item_price: number;
        family_id: number;
    }

    interface toppingRow {
        topping_id: number;
        family_id: number;
        topping: string;
        topping_price: number;
    }

    const [servedItemRow, setRows] = useState<servedItemRow | null>(null); // Initialize with null

    const fetchServedItemInfo = () => {
        axios.post('/getServedItemInfo', {item_id: props.item.item_id})
            .then(res => {
                const data: servedItemRow = res.data.data[0]; // Access the data property of the response
                console.log(data);
                setRows(data); // Set the state with the received data
            })
            .catch(err => console.log(err));
    };
    
    const [toppingRows, setToppingRows] = useState<toppingRow[]>([]); // Initialize with empty array

    const fetchToppings = () => {
        axios.post('/getOrderItemToppings', {order_item_id: props.item.order_item_id})
            .then(res => {
                const data: toppingRow[] = res.data.data; // Access the data property of the response
                setToppingRows(data); // Set the state with the received data
            })
            .catch(err => console.log(err));
    };
    
    useEffect(() => {
        fetchServedItemInfo();
        fetchToppings();
    }, []);

    return (
        <div className="pendingItem">
            <div className="itemName"> {formatCamelCase(servedItemRow?.served_item ?? '')}</div>
            {toppingRows.map((topping, index) => (
                <div key={index} className="toppingName"> {topping.topping}</div>
            ))}
        </div>
    );
};

export default PendingOrder;