import React, {useState, useEffect} from 'react';
import axios from 'axios';

interface ViewToppingModalProps {
    closeModal: () => void
    order_item_id: number
}

const ViewToppingModal: React.FC<ViewToppingModalProps> = ({closeModal, order_item_id}) => {
    interface Row {
        topping_id: number;
        topping: string;
        topping_price: number;
    }

    interface Data {
        data: Row[];
    }

    const [rows, setRows] = useState<any []>([]);

    useEffect(() => {
        axios.post('/getOrderItemToppings', {order_item_id: order_item_id})
        .then(res => {
            const data: Data = res.data;
            const items: Row[] = data.data;
            console.log(res.data);
            setRows(items);
            console.log(items);
        })
        .catch(er => console.log(er));
    }, [order_item_id]);

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
    );  

}

export default ViewToppingModal;