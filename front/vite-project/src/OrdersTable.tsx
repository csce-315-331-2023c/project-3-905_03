import React, {useState} from 'react';
import "./Table.css";
import {BsFillTrashFill, BsEyeFill} from 'react-icons/bs'

function OrdersTable() {
    const [rows, setRows] = useState([
        {employee_id: 13, order_id: 0, order_total: "41.19", takeout: "1", split: "1", order_date: "2023-02-01 20:29:21"},
        {employee_id: 13, order_id: 1, order_total: "47.52", takeout: "1", split: "1", order_date: "2023-01-31 15:49:13"},
        {employee_id: 9, order_id: 2, order_total: "63.81", takeout: "0", split: "1", order_date: "2023-03-11 07:34:36"}
    ]);
    const [employeeID, setEmployeeID] = useState(-1);
    const [orderID, setOrderID] = useState(-1);
    const [orderTotal, setOrderTotal] = useState('');
    const [takeout, setTakeout] = useState('');
    const [split, setSplit] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [rowToEdit, setRowToEdit] = useState(null);
    
    const handleDeleteRow = (targetIndex: number) => {
        setRows(rows.filter((_, idx) => idx !== targetIndex))
    };
    
    return (
        <div className='table-container'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Order ID</th>
                        <th>Order Total</th>
                        <th>Takeout</th>
                        <th>Split</th>
                        <th className='expand'>Order Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rows.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row.employee_id}</td>
                                <td>{row.order_id}</td>
                                <td>{row.order_total}</td> 
                                <td>{row.takeout}</td>
                                <td>{row.split}</td>
                                <td className='expand'>{row.order_date}</td>
                                <td>
                                    <span className='actions'>
                                        <BsEyeFill className="view-btn"/>
                                        <BsFillTrashFill className="delete-btn" onClick={() => handleDeleteRow(idx)}/>
                                    </span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default OrdersTable