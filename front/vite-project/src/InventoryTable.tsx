import React, {useState} from 'react';
import "./Table.css";
import {BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs'

function InventoryTable() {
    const [rows, setRows] = useState([
        {stock_id: 0, stock_item: "chicken", cost: "6.95", stock_quantity: "39", max_amount: "120"},
        {stock_id: 1, stock_item: "waffles", cost: "3.95", stock_quantity: "62", max_amount: "128"},
        {stock_id: 2, stock_item: "eggs", cost: "1.95", stock_quantity: "90", max_amount: "122"}
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
                    stock_item: name,
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

export default InventoryTable