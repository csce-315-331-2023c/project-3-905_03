import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/KitchenDisplay.css';
import PendingItem from '../Components/PendingItem';

interface OrderProps {
    order: {
        employee_id: number;
        order_id: number;
        order_total: number;
        takeout: boolean;
        order_date: string;
        status: string;
    };
    isSelected: boolean;
    onSelect: () => void;
}

/**
 * `PendingOrder` is a React component that displays a pending order.
 * 
 * @remarks
 * This component fetches the order items from the server, calculates the elapsed time since the order was placed, and displays the order.
 * The order items are fetched when the component mounts.
 * The elapsed time is updated every 30 seconds.
 * If the elapsed time is more than 20 minutes, the order is marked as late.
 * 
 * @param order - The order to display
 * @param isSelected - Whether the order is selected
 * @param onSelect - Function to select the order
 * 
 * @returns The rendered `PendingOrder` component
 */
const PendingOrder: React.FC<OrderProps> = ({ order, isSelected, onSelect }) => {
    interface itemRow {
        order_item_id: number;
        order_id: number;
        item_id: number;
    }

    interface OrderItems {
        data: itemRow[];
    }
    const [itemRow, setRows] = useState<itemRow[]>([]); // Use Row[] instead of any[]

    const fetchOrderItems = () => {
        axios.post('/getOrderItems', {order_id: order.order_id})
            .then(res => {
                const data: OrderItems = res.data;
                setRows(data.data);
            })
            .catch(err => console.log(err));
    };
    
    useEffect(() => {
        fetchOrderItems();
        calculateElapsedTime(order.order_date);
    }, []);
    
    const [isLate, setIsLate] = useState(false);

    const [elapsedTime, setElapsedTime] = useState('');

    useEffect(() => {

        const initialElapsedTime = calculateElapsedTime(order.order_date);
        setElapsedTime(initialElapsedTime);
        
        const timer = setInterval(() => {
            const newElapsedTime = calculateElapsedTime(order.order_date);
            setElapsedTime(newElapsedTime);
        }, 30000); // update every 30

        return () => clearInterval(timer); // cleanup on unmount
    }, []);

    const calculateElapsedTime = (orderDate: string) => {
        const orderDateTime = new Date(orderDate);
        const currentDateTime = new Date();
        const differenceInMilliseconds = currentDateTime.getTime() - orderDateTime.getTime();
        const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        const differenceInHours = Math.floor(differenceInMinutes / 60);

        if (differenceInMinutes > 20) {
            setIsLate(true);
        }

        return `${differenceInHours} hrs, ${differenceInMinutes % 60} mins ago`;
    };
  
    return (
        <div className={`pendingOrder ${isLate ? 'lateOrder' : ''} ${isSelected ? 'selectedOrder' : ''}`} onClick={onSelect}>
            <div className="orderInfo">
                <div className="orderNumber">{order.order_id.toString().slice(-2)}</div>
                <div className="orderTime">{elapsedTime}</div>
            </div>
            {itemRow.map((row, index) => (
                <PendingItem key={index} item={row} />
            ))}
        </div>
    );
}

export default PendingOrder;