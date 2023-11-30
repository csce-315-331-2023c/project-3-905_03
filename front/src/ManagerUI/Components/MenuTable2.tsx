import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Table.css";
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';
import AddMenuModal from './AddMenuModal';
import MUIDataTable, { MUIDataTableMeta } from "mui-datatables";
import { Edit, Delete } from '@mui/icons-material';

interface Row {
    item_id: number;
    served_item: string;
    item_price: number;
}

function MenuTable() {
    const [rows, setRows] = useState<Row[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {
        axios.get('/getServedItems')
            .then(res => {
                const data: Row[] = res.data.data;
                setRows(data);
            })
            .catch(err => console.log(err));
    }, []);

    const columns = [
        { name: 'item_id', label: 'Item ID', options: {sort: true, filter: false} },
        { name: 'served_item', label: 'Item Name', options: {sort: true, filter: false} },
        { name: 'item_price', label: 'Price', options: {sort: true, filter: false} },
        {
            name: 'Actions',
            options: {
                customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                    return (
                        <span className='actions'>
                            <Edit onClick={() => handleEditRow(tableMeta.rowData[0])} />
                            <Delete onClick={() => handleDeleteRow(tableMeta.rowIndex)} />
                        </span>
                    );
                },
                sort: false,
                filter: false,
            }
        },
    ];

    const handleDeleteRow = (targetIndex: number) => {
        axios.post('/deleteServedItem', rows[targetIndex])
            .then(() => {
                const newRows = [...rows];
                newRows.splice(targetIndex, 1);
                setRows(newRows);
            })
            .catch(err => console.log(err));
    };

    const handleEditRow = (item_id: number) => {
        setEditId(item_id);
    };

    const handleAddRow = (newRow: Row) => {
        axios.post('/addServedItem', newRow)
            .then(() => {
                setRows(prevRows => [...prevRows, newRow]);
            })
            .catch(err => console.log(err));
    };
    
    const options = {
        filterType: 'checkbox' as const,
        search: true,
        jumpToPage: true,
    };

    return (
        <div className='table-container'>
            <MUIDataTable
                title={"Menu List"}
                data={rows}
                columns={columns}
                options={options}
            />
            <button className='btn' onClick={() => setModalOpen(true)}>Add New Menu Item</button>
            {modalOpen && <AddMenuModal closeModal={() => setModalOpen(false)} onSubmit={handleAddRow} maxID={0} />}
        </div>
    );
}

export default MenuTable;