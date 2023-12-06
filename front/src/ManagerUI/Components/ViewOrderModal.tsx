import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "../Styles/AddMenuModal.css";
import "../Styles/Table.css"
import ViewToppingModal from './ViewToppingModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from '@mui/material';

interface ViewOrderModalProps {
    closeModal: () => void
    order_id: number
    openParentModal: (order_id: number) => void
}

/**
 * `ViewOrderModal` is a React component that displays a modal for viewing the details of an order.
 * 
 * @remarks
 * This component fetches the order items for the given order ID from the server and displays them in a table.
 * The user can view the add-ons for each order item.
 * The table includes columns for the item ID, item name, price, and a button to view the add-ons.
 * If the user clicks outside the modal, the modal is closed.
 * 
 * @param closeModal - Function to close the modal
 * @param order_id - The ID of the order to view
 * @param openParentModal - Function to open the parent modal
 * 
 * @returns The rendered `ViewOrderModal` component
 */
const ViewOrderModal: React.FC<ViewOrderModalProps> = ({closeModal, order_id, openParentModal}) => {
    
    interface Row {
        item_id: number;
        served_item: string;
        item_price: string;
        order_item_id: string;
    }
    
    interface Data {
        data: Row[];
    }

    const [rows, setRows] = useState<any []>([]);
    const [modalOpen, setModalOpen] = useState<number | null>(null);

    useEffect(() => {
        axios.post('/getOrderItems', {order_id: order_id})
        .then(res => {
            const data: Data = res.data;
            const items: Row[] = data.data;
            console.log(res.data);
            setRows(items);
            console.log(items);
        })
        .catch(er => console.log(er));
    }, [order_id]);

    return (
        <div className='modal-container' 
        onClick={(e) => {
            const target = e.target as HTMLTextAreaElement
            if (target.className === "modal-container") closeModal();
            }}>
            <div className='modal'>
                <table>
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th className='expand'>Item Name</th>
                            <th>Price</th>
                            <th>View Add Ons</th>
                        </tr>
                    </thead>
                    <tbody className='modal-body'>
                        {
                            rows.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.item_id}</td>
                                    <td className='expand'>{row.served_item}</td>
                                    <td>{row.item_price}</td> 
                                    <td>
                                        <IconButton onClick={() => {setModalOpen(idx)}}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </td>
                                    {modalOpen === idx && <ViewToppingModal key={idx} closeModal={() => setModalOpen(null)} order_item_id={row.order_item_id} openModal={openParentModal}/>}
                                </tr>
                            ))
                        }
                    </tbody>
            </table>
            </div>
        </div>
    )
}

export default ViewOrderModal