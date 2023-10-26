import React, {useState} from 'react';
import "./Table.css";
import {BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs'

function Table() {
    const [rows, setRows] = useState([
        {item_id: 0, served_item: "chickenAndWafflesSnack", item_price: 6.95},
        {item_id: 1, served_item: "chickenAndWafflesRegular", item_price: 11.85},
        {item_id: 2, served_item: "chickenAndWafflesPlus", item_price: 15.65}
    ]);
    const [editId, setEditId] = useState(-1);
    const [rowToEdit, setRowToEdit] = useState(null);
    
    const handleDeleteRow = (targetIndex: number) => {
        setRows(rows.filter((_, idx) => idx !== targetIndex))
    };

    const handleEditRow = (item_id: number) => {
        setEditId(item_id)
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
                                <td><input type="text" value={row.served_item}/></td>
                                <td><input type="text" value={row.item_price} /></td>
                                <td><button>Update</button></td>
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

export default Table