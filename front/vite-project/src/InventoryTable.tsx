import React, {useState, useEffect} from 'react';
import axios from 'axios'
import "./Table.css";
import {BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs'
import AddInventoryModal from './AddInventoryModal';

function InventoryTable() {
    interface Row {
        stock_id: number;
        stock_item: string;
        cost: string;
        stock_quantity: string;
        max_amount: string;
    }

    interface Data {
        data: Row[];
    }

    const [rows, setRows] = useState<any []>([]);
    const [editId, setEditId] = useState(-1);
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [quantity, setQuantity] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    let maxStockId = -1;
    for (let row of rows){
        if (row.stock_id > maxStockId){
            maxStockId = row.stock_id;
        }
    }

    useEffect(() => {
        axios.get('http://localhost:8080/getStockItems')
        .then(res => {
            const data: Data = res.data;
            const items: Row[] = data.data;
            setRows(items);
        })
        .catch(er => console.log(er));
    }, []);
    
    
    const handleDeleteRow = (targetIndex: number) => {
        axios.post('http://localhost:8080/deleteStockItem', rows[targetIndex])
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

    const handleAddRow = (newRow: Row): void => {
        axios.post('http://localhost:8080/addStockItem', newRow)
        setRows([...rows, newRow])
    }

    const handleUpdate = () => {
        const updatedRows = rows.map((row) => {
            if (row.stock_id === editId){
                axios.post('http://localhost:8080/editStockItem', {stock_id: row.stock_id, stock_item: name, cost: cost, stock_quantity: quantity, max_amount: maxAmount})
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
            <button className='btn' onClick={() => setModalOpen(true)}>Create New Inventory Item</button>
            {modalOpen && <AddInventoryModal closeModal={() => (
                setModalOpen(false)
            )} onSubmit={handleAddRow} maxID={maxStockId}/>}
        </div>
    )
}

export default InventoryTable