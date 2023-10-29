import React, {useState} from 'react';
import "./Table.css";
import {BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs'

function OrdersTable() {
    const [rows, setRows] = useState([
        {employee_id: 13, order_id: 0, order_total: 41.19, takeout: "39", split: "120", order_date: "2023-02-01 20:29:21"},
        {employee_id: 0, order_id: "chicken", order_total: "6.95", takeout: "39", split: "120", order_date: "2023-02-01 20:29:21"},
        {employee_id: 0, order_id: "chicken", order_total: "6.95", takeout: "39", split: "120", order_date: "2023-02-01 20:29:21"}
    ]);
    const [editId, setEditId] = useState(-1);
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [quantity, setQuantity] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [rowToEdit, setRowToEdit] = useState(null);
    
    const handleDeleteRow = (targetIndex: number) => {
        setRows(rows.filter((_, idx) => idx !== targetIndex))
    };

    const handleEditRow = (stock_id: number) => {
        rows.map((row) => {
            if (row.stock_id === stock_id){
                setName(row.stock_item)
                setCost(row.cost)
                setQuantity(row.stock_quantity)
                setMaxAmount(row.max_amount)
            }
        })
        setEditId(stock_id)
    }

    const handleUpdate = () => {
        const updatedRows = rows.map((row) => {
            if (row.stock_id === editId){
                return {
                    ...row,
                    served_item: name,
                    cost: cost,
                    stock_quantity: quantity,
                    max_amount: maxAmount
                };
            }
            return row;
        });

        setRows(updatedRows);
        setEditId(-1);
        setName('')
        setCost('')
        setQuantity('')
        setMaxAmount('')
    }

    
    return (
        <div className='table-container'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Stock ID</th>
                        <th className='expand'>Stock Name</th>
                        <th>Cost</th>
                        <th>Quantity</th>
                        <th>Maximum Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rows.map((row, idx) => (
                            row.stock_id === editId ?
                            <tr>
                                <td>{row.stock_id}</td>
                                <td><input type="text" value={name} onChange={e => setName(e.target.value)}/></td>
                                <td><input type="text" value={cost} onChange={e => setCost(e.target.value)}/></td>
                                <td><input type="text" value={quantity} onChange={e => setQuantity(e.target.value)}/></td>
                                <td><input type="text" value={maxAmount} onChange={e => setMaxAmount(e.target.value)}/></td>
                                <td><button onClick={handleUpdate}>Update</button></td>
                            </tr>
                            :
                            <tr key={idx}>
                                <td>{row.stock_id}</td>
                                <td className='expand'>{row.stock_item}</td>
                                <td>{row.cost}</td> 
                                <td>{row.stock_quantity}</td>
                                <td>{row.max_amount}</td>
                                <td>
                                    <span className='actions'>
                                        <BsFillPencilFill className="edit-btn" onClick={() => handleEditRow(row.stock_id)}/>
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