import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { IconButton } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


interface ViewToppingModalProps {
    closeModal: () => void
    order_item_id: number
    openModal: (order_item_id: number) => void  
}

/**
 * `ViewToppingModal` is a React component that displays a modal for viewing the toppings of an order item.
 * 
 * @remarks
 * This component fetches the toppings for the given order item ID from the server and displays them in a table.
 * The user can view the ID, name, and price of each topping.
 * If the order item has no toppings, it displays a message saying "This Item has No Add Ons".
 * If the user clicks the back button, the modal is closed and the parent modal is opened.
 * 
 * @param closeModal - Function to close the modal
 * @param order_item_id - The ID of the order item to view
 * @param openModal - Function to open the parent modal
 * 
 * @returns The rendered `ViewToppingModal` component
 */
const ViewToppingModal: React.FC<ViewToppingModalProps> = ({closeModal, order_item_id, openModal}) => {
    interface Row {
        topping_id: number;
        topping: string;
        topping_price: number;
    }

    interface Data {
        data: Row[];
    }

    const [rows, setRows] = useState<any []>([]);
    const [hasToppings, setHasToppings] = useState<boolean>(false);

    useEffect(() => {
        axios.post('/getOrderItemToppings', {order_item_id: order_item_id})
        .then(res => {
            if (res.data.data.length > 0){
                setHasToppings(true);
                const data: Data = res.data;
                const items: Row[] = data.data;
                console.log(res.data);
                setRows(items);
                console.log(items);
            }else{
                setHasToppings(false);
            }
            
        })
        .catch(er => console.log(er));
    }, [order_item_id]);

    return (
        <div className='modal-container'>
            {hasToppings === true ? (
                <div>
                    <div className='modal-header'>
                        <IconButton onClick={() => {closeModal(), openModal(order_item_id)}}>
                            <KeyboardBackspaceIcon />
                        </IconButton>
                    </div>
                    <div className='modal'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Topping ID</th>
                                    <th className='expand'>Topping Name</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody className='modal-body'>
                                {
                                    rows.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>{row.topping_id}</td>
                                            <td className='expand'>{row.topping}</td>
                                            <td>{row.topping_price}</td> 
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            ): (
                <div>
                    <div className='modal-header'>
                        <IconButton onClick={() => {closeModal(), openModal(order_item_id)}}>
                            <KeyboardBackspaceIcon />
                        </IconButton>
                    </div>
                    <div className='modal'>
                        <h3>This Item has No Add Ons</h3>
                    </div>
                </div>
            )}
        </div>
    );  

}

export default ViewToppingModal;