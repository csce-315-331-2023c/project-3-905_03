import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Table.css";
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';
import AddInventoryModal from './AddInventoryModal';
import MUIDataTable, { MUIDataTableMeta } from "mui-datatables";
import { Edit, Delete } from '@mui/icons-material';


interface Row {
    stock_id: number;
    stock_item: string;
    cost: number;
    stock_quantity: number;
    max_amount: number;
}

function InventoryTable2() {
    const [rows, setRows] = useState<Row[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {
        axios.get('/getStockItems')
            .then(res => {
                const data: Row[] = res.data.data;
                setRows(data);
            })
            .catch(err => console.log(err));
    }, []);

    const columns = [
        { name: 'stock_id', label: 'Stock ID', options: {sort: true, filter: true} },
        { name: 'stock_item', label: 'Stock Item', options: {sort: true, filter: true} },
        { name: 'cost', label: 'Cost', options: {sort: true, filter: true} },
        { name: 'stock_quantity', label: 'Quantity', options: {sort: true, filter: true} },
        { name: 'max_amount', label: 'Max Amount', options: {sort: true, filter: true} },
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
        axios.post('/deleteStockItem', rows[targetIndex])
            .then(() => {
                const newRows = [...rows];
                newRows.splice(targetIndex, 1);
                setRows(newRows);
            })
            .catch(err => console.log(err));
    };

    const handleEditRow = (stock_id: number) => {
        setEditId(stock_id);
    };

    const handleAddRow = (newRow: Row) => {
        axios.post('/addStockItem', newRow)
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
                title={"Inventory List"}
                data={rows}
                columns={columns}
                options={options}
            />
            <button className='btn' onClick={() => setModalOpen(true)}>Add New Inventory</button>
            {modalOpen && <AddInventoryModal closeModal={() => setModalOpen(false)} onSubmit={handleAddRow} maxID={0} />}
        </div>
    );
}

export default InventoryTable2;