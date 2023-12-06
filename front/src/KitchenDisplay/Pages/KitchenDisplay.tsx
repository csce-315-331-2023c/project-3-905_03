import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/KitchenDisplay.css';
import PendingOrder from '../Components/PendingOrder';

/**
 * `KitchenDisplay` is a React component that displays the kitchen orders.
 * 
 * @remarks
 * This component fetches the pending orders from the server every 5 seconds and displays them.
 * Each order can be selected, and the selected order can be fulfilled or cancelled.
 * When an order is fulfilled or cancelled, the server is notified and the pending orders are refreshed.
 * 
 * @returns The rendered `KitchenDisplay` component
 */
const KitchenDisplay: React.FC = () => {
    interface orderRow {
        employee_id: number;
        order_id: number;
        order_total: number;
        takeout: boolean;
        order_date: string;
        status: string;
    }

    interface PendingOrders {
        data: orderRow[];
    }
    
    const [orderRow, setRows] = useState<orderRow[]>([]); // Use Row[] instead of any[]
    const [selectedOrder, setSelectedOrder] = useState<orderRow | null>(null);

    const fetchPendingOrders = () => {
        axios.get('/getPendingOrders')
            .then(res => {
                const data: PendingOrders = res.data;
                setRows(data.data);
            })
            .catch(err => console.log(err));
    };
    
    useEffect(() => {
        fetchPendingOrders();

        setInterval(() => {
            fetchPendingOrders();
        }, 5000); // update every 5 seconds
    }, []);

    return (
        <div className="kitchen-display-container">
            <div className="order-container">
                {orderRow.map((row, index) => (
                    <PendingOrder
                    key={index}
                    order={row}
                    isSelected={selectedOrder?.order_id === row.order_id}
                    onSelect={() => {
                        setSelectedOrder(row);
                        console.log(row.order_id);
                    }}
                />
                ))}
            </div>
            <div className="buttons-container">
            <button
            onClick={() => {
                if (selectedOrder) {
                    axios.post('/fulfillOrder', { order_id: selectedOrder.order_id })
                        .then(res => {
                            console.log(res.data);
                            // Refresh the pending orders after a successful fullfilment
                            fetchPendingOrders();
                        })
                        .catch(err => console.log(err));
                    }
                }}
            >
                Fulfill
            </button>
            <button
            onClick={() => {
                if (selectedOrder) {
                    axios.post('/cancelOrder', { order_id: selectedOrder.order_id })
                        .then(res => {
                            console.log(res.data);
                            // Refresh the pending orders after a successful cancellation
                            fetchPendingOrders();
                        })
                        .catch(err => console.log(err));
                    }
                }}
            >
                Cancel
            </button>
            </div>
        </div>
    );
};

export default KitchenDisplay;
