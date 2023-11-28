import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "../Styles/AddMenuModal.css";
import "../Styles/Table.css"

interface ViewOrderModalProps {
    closeModal: () => void
    order_id: number
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({closeModal, order_id}) => {
    
    interface Row {
        item_id: number;
        served_item: string;
        item_price: string;
    }
    
    interface Data {
        data: Row[];
    }

    const [rows, setRows] = useState<any []>([]);

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
                        </tr>
                    </thead>
                    <tbody className='modal-body'>
                        {
                            rows.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.item_id}</td>
                                    <td className='expand'>{row.served_item}</td>
                                    <td>{row.item_price}</td> 
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