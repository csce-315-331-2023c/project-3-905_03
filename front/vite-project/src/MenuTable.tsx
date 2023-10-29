import React, {useState} from 'react';
import "./Table.css";
import {BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs'

function MenuTable() {
    const [rows, setRows] = useState([
        {item_id: 0, served_item: "chickenAndWafflesSnack", item_price: "6.95"},
        {item_id: 1, served_item: "chickenAndWafflesRegular", item_price: "11.85"},
        {item_id: 2, served_item: "chickenAndWafflesPlus", item_price: "15.65"}
    ]);
    const [editId, setEditId] = useState(-1);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [rowToEdit, setRowToEdit] = useState(null);
    
    const handleDeleteRow = (targetIndex: number) => {
        setRows(rows.filter((_, idx) => idx !== targetIndex))
    };

    const handleEditRow = (item_id: number) => {
        rows.map((row) => {
            if (row.item_id === item_id){
                setName(row.served_item)
                setPrice(row.item_price)
            }
        })
        setEditId(item_id)
    }

    const handleUpdate = () => {
        const updatedRows = rows.map((row) => {
            if (row.item_id === editId){
                return {
                    ...row,
                    served_item: name,
                    item_price: price
                };
            }
            return row;
        });

        setRows(updatedRows);
        setEditId(-1);
        setName('')
        setPrice('')
    }

    
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
                            <tr>
                                <td>{row.item_id}</td>
                                <td><input type="text" value={name} onChange={e => setName(e.target.value)}/></td>
                                <td><input type="text" value={price} onChange={e => setPrice(e.target.value)}/></td>
                                <td><button onClick={handleUpdate}>Update</button></td>
                            </tr>
                            :
                            <tr key={idx}>
                                <td>{row.item_id}</td>
                                <td className='expand'>{row.served_item}</td>
                                <td>{row.item_price}</td> 
                                <td>
                                    <span className='actions'>
                                        <BsFillPencilFill className="edit-btn" onClick={() => handleEditRow(row.item_id)}/>
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

export default MenuTable