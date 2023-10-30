import React, {useState, useEffect} from 'react';
import axios from 'axios'
import "./Table.css";
import {BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs'
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

    const [rows, setRows] = useState<any []>([]);
    const [editId, setEditId] = useState(-1);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(-1);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/getServedItems')
        .then(res => {
            const data: Data = res.data;
            const items: Row[] = data.data;
            setRows(items);
        })
        .catch(er => console.log(er));
    }, []);
    
    const handleDeleteRow = (targetIndex: number) => {
        axios.post('http://localhost:8080/deleteServedItem', rows[targetIndex])
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

    const handleAddRow = (newRow: Row): void => {
        setRows([...rows, newRow])
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
        setPrice(-1)
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
                                <td><input type="text" value={price} onChange={e => setPrice(e.target.valueAsNumber)}/></td>
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
            <button className='btn' onClick={() => setModalOpen(true)}>Create New Menu Item</button>
            {modalOpen && <AddMenuModal closeModal={() => (
                setModalOpen(false)
            )} onSubmit={handleAddRow}/>}
        </div>
    )
}

export default MenuTable