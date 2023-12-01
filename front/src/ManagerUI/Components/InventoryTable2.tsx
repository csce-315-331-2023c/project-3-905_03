import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Table.css";
import AddInventoryModal from './AddInventoryModal';
import MUIDataTable, { MUIDataTableMeta } from "mui-datatables";
import { Edit, Delete, Check, Close } from '@mui/icons-material';
import { TextField } from '@mui/material';


interface Row {
    stock_id: number;
    stock_item: string;
    cost: number;
    stock_quantity: number;
    max_amount: number;
}

function InventoryTable2() {
    const [rows, setRows] = useState<Row[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editRow, setEditRow] = useState<number | null>(null);
    const [editData, setEditData] = useState<Row | null>(null);

    useEffect(() => {
        axios.get('/getStockItems')
            .then(res => {
                const data: Row[] = res.data.data;
                setRows(data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleEditRow = (tableMeta: MUIDataTableMeta) => {
        setEditRow(tableMeta.rowIndex);
        setEditData(rows[tableMeta.rowIndex]);
    };

    const handleCancelEdit = () => {
        setEditRow(null);
        setEditData(null);
    };

    const handleConfirmEdit = () => {
        if (editData) {
            axios.post('/editStockItem', editData)
                .then(() => {
                    const newRows = [...rows];
                    newRows[editRow as number] = editData;
                    setRows(newRows);
                    setEditRow(null);
                    setEditData(null);
                })
                .catch(err => console.log(err));
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditData(prevData => {
            if (prevData) {
                return { ...prevData, [event.target.name]: event.target.value };
            } else {
                return {
                    stock_id: 0, // default value
                    stock_item: '', // default value
                    cost: 0, // default value
                    stock_quantity: 0, // default value
                    max_amount: 0, // default value
                };
            }
        });
    };

    const handleDeleteRow = (targetIndex: number) => {
        axios.post('/deleteStockItem', rows[targetIndex])
            .then(() => {
                const newRows = [...rows];
                newRows.splice(targetIndex, 1);
                setRows(newRows);
            })
            .catch(err => console.log(err));
    };

    const handleAddRow = (newRow: Row) => {
        axios.post('/addStockItem', newRow)
            .then(() => {
                setRows(prevRows => [...prevRows, newRow]);
            })
            .catch(err => console.log(err));
    };
    
    const columns = [
        { name: 'stock_id', label: 'Stock ID', options: {sort: true, filter: true} },
        { name: 'stock_item', label: 'Stock Item', options: {sort: true, filter: true,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="stock_item" label="Stock Item" value={editData?.stock_item} onChange={handleInputChange} variant='outlined' style={{ outline: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'cost', label: 'Cost', options: {sort: true, filter: true,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="cost" label="Cost" value={editData?.cost} onChange={handleInputChange} variant='outlined' style={{ outline: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'stock_quantity', label: 'Quantity', options: {sort: true, filter: true,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="stock_quantity" label="Stock Quantity" value={editData?.stock_quantity} onChange={handleInputChange} variant='outlined' style={{ outline: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'max_amount', label: 'Maximum Amount', options: {sort: true, filter: true,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="max_amount" label="Maximum Amount" value={editData?.max_amount} onChange={handleInputChange} variant='outlined' style={{ outline: 'none' }}/>;
                }
                return value;
            }} },
        {
            name: 'Actions',
            options: {
                customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                    if (editRow === tableMeta.rowIndex) {
                        return (
                            <span className='actions'>
                                <Check onClick={handleConfirmEdit} />
                                <Close onClick={handleCancelEdit} />
                            </span>
                        );
                    }else{
                        return (
                            <span className='actions'>
                                <Edit onClick={() => handleEditRow(tableMeta)} />
                                <Delete onClick={() => handleDeleteRow(tableMeta.rowIndex)} />
                            </span>
                        );
                    }
                },
                sort: false,
                filter: false,
            }
        },
    ];

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