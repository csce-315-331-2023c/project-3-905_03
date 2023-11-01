import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Table.css";
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';
import AddMenuModal from './AddMenuModal';

function MenuTable() {
    interface Row {
        item_id: number;
        served_item: string;
        item_price: number;
    }

    interface Data {
        data: Row[];
    }

    const [rows, setRows] = useState<any[]>([]);
    const [editId, setEditId] = useState(-1);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(-1);
    const [modalOpen, setModalOpen] = useState(false);
    let maxItemId = -1;
    for (let row of rows) {
        if (row.item_id > maxItemId) {
            maxItemId = row.item_id;
        }
    }

    const fetchMenuItems = () => {
        axios.get('http://localhost:8080/getServedItems')
            .then(res => {
                const data: Data = res.data;
                setRows(data.data);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const handleDeleteRow = (targetIndex: number) => {
        axios.post('http://localhost:8080/deleteServedItem', rows[targetIndex])
            .then(() => {
                fetchMenuItems();  // Refresh items after delete
            })
            .catch(err => console.log(err));
    };

    const handleAddRow = (newRow: Row): void => {
        axios.post('http://localhost:8080/addServedItem', newRow)
            .then(() => {
                fetchMenuItems();  // Refresh items after add
            })
            .catch(err => console.log(err));
    };

    const handleEditRow = (item_id: number) => {
        rows.map((row) => {
            if (row.item_id === item_id) {
                setName(row.served_item);
                setPrice(row.item_price);
            }
        });
        setEditId(item_id);
    };

    const handleUpdate = () => {
        axios.post('http://localhost:8080/editServedItem', { item_id: editId, served_item: name, item_price: price })
            .then(() => {
                fetchMenuItems();  // Refresh items after update
            })
            .catch(err => console.log(err));
        setEditId(-1);
        setName('');
        setPrice(-1);
    };

    return (
        <div className='table-container'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th className='expand'>Item Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rows.map((row, idx) => (
                            row.item_id === editId ?
                                <tr key={idx}>
                                    <td>{row.item_id}</td>
                                    <td><input type="text" value={name} onChange={e => setName(e.target.value)} /></td>
                                    <td><input type="text" value={price} onChange={e => setPrice(e.target.valueAsNumber)} /></td>
                                    <td><button onClick={handleUpdate}>Update</button></td>
                                </tr>
                                :
                                <tr key={idx}>
                                    <td>{row.item_id}</td>
                                    <td className='expand'>{row.served_item}</td>
                                    <td>{row.item_price}</td>
                                    <td>
                                        <span className='actions'>
                                            <BsFillPencilFill className="edit-btn" onClick={() => handleEditRow(row.item_id)} />
                                            <BsFillTrashFill className="delete-btn" onClick={() => handleDeleteRow(idx)} />
                                        </span>
                                    </td>
                                </tr>
                        ))
                    }
                </tbody>
            </table>
            <button className='btn' onClick={() => setModalOpen(true)}>Create New Menu Item</button>
            {modalOpen && <AddMenuModal closeModal={() => setModalOpen(false)} onSubmit={handleAddRow} maxID={maxItemId} />}
        </div>
    );
}

export default MenuTable;
