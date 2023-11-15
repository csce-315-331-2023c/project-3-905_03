import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Table.css";
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';
import AddInventoryModal from './AddInventoryModal';

function InventoryTable() {
    interface Row {
        stock_id: number;
        stock_item: string;
        cost: number;
        stock_quantity: number;
        max_amount: number;
    }

    interface Data {
        data: Row[];
    }

    const [rows, setRows] = useState<Row[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [name, setName] = useState<string>('');
    const [cost, setCost] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [maxAmount, setMaxAmount] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    


    const fetchInventoryItems = () => {
        axios.get('/getStockItems')
            .then(res => {
                const data: Data = res.data;
                setRows(data.data);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchInventoryItems();
    }, []);

    const handleDeleteRow = (targetIndex: number) => {
        axios.post('/deleteStockItem', rows[targetIndex])
            .then(() => {
                fetchInventoryItems();  // Refresh items after delete
            })
            .catch(err => console.log(err));
    };

    const handleAddRow = (newRow: Row) => {
        axios.post('/addStockItem', newRow)
            .then(() => {
                fetchInventoryItems(); 
            })
            .catch(err => console.log(err));
    };

    const handleEditRow = (stock_id: number) => {
        const row = rows.find(r => r.stock_id === stock_id);
        if (row) {
            setName(row.stock_item);
            setCost(row.cost);
            setQuantity(row.stock_quantity);
            setMaxAmount(row.max_amount);
            setEditId(stock_id);
        }
    };

    const handleUpdate = () => {
        if (editId === null) return;

        axios.post('/editStockItem', { stock_id: editId, stock_item: name, cost, stock_quantity: quantity, max_amount: maxAmount })
            .then(() => {
                fetchInventoryItems();  
            })
            .catch(err => console.log(err));

        setEditId(null);
        setName('');
        setCost(0);
        setQuantity(0);
        setMaxAmount(0);
    };

    return (
        <div className='table-container'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Stock ID</th>
                        <th className='expand'>Stock Item</th>
                        <th>Cost</th>
                        <th>Quantity</th>
                        <th>Max Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rows.map((row, idx) => (
                            row.stock_id === editId ?
                                <tr key={idx}>
                                    <td>{row.stock_id}</td>
                                    <td><input type="text" value={name} onChange={e => setName(e.target.value)} /></td>
                                    <td><input type="number" value={cost || ''} onChange={e => setCost(e.target.valueAsNumber)} /></td>
                                    <td><input type="number" value={quantity || ''} onChange={e => setQuantity(e.target.valueAsNumber)} /></td>
                                    <td><input type="number" value={maxAmount || ''} onChange={e => setMaxAmount(e.target.valueAsNumber)} /></td>
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
                                            <BsFillPencilFill className="edit-btn" onClick={() => handleEditRow(row.stock_id)} />
                                            <BsFillTrashFill className="delete-btn" onClick={() => handleDeleteRow(idx)} />
                                        </span>
                                    </td>
                                </tr>
                        ))
                    }
                </tbody>
            </table>
            <button className='btn' onClick={() => setModalOpen(true)}>Add New Inventory</button>
            {modalOpen && <AddInventoryModal closeModal={() => setModalOpen(false)} onSubmit={handleAddRow} maxID={0} />}
        </div>
    );
}

export default InventoryTable;

