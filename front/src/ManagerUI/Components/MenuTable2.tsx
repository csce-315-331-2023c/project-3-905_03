import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Table.css";
import AddMenuModal from './AddMenuModal';
import MUIDataTable, { MUIDataTableMeta } from "mui-datatables";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

interface Row {
    item_id: number;
    served_item: string;
    item_price: number;
    family_name: string;
}

function MenuTable() {
    const [rows, setRows] = useState<Row[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editRow, setEditRow] = useState<number | null>(null);
    const [editData, setEditData] = useState<Row | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        Promise.all([
            axios.get('/getServedItems'),
            axios.get('/getItemCategories')
        ])
        .then(([servedItemsRes, itemCategoryRes]) => {
            const servedItemsData: Row[] = servedItemsRes.data.data;
            const itemCategoryData: { family_category: string }[] = itemCategoryRes.data.data;
    
            const data = servedItemsData.map((item, index) => ({
                ...item,
                item_category: itemCategoryData[index].family_category
            }));
    
            setRows(data);
            setIsLoading(false);
        })
    }, []);

    const handleDeleteRow = (targetIndex: number) => {
        axios.post('/deleteServedItem', rows[targetIndex])
            .then(() => {
                const newRows = [...rows];
                newRows.splice(targetIndex, 1);
                setRows(newRows);
            })
            .catch(err => console.log(err));
    };

    const handleAddRow = (newRow: Row) => {
        axios.post('/addServedItem', newRow)
            .then(() => {
                setRows(prevRows => [...prevRows, newRow]);
            })
            .catch(err => console.log(err));
    };

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
                    item_id: 0, // default value
                    served_item: '', // default value
                    item_price: 0, // default value
                    family_name: '', // default value
                };
            }
        });
    };

    const columns = [
        { name: 'item_id', label: 'Item ID', options: {sort: true, filter: false} },
        { name: 'served_item', label: 'Item Name', options: {sort: true, filter: false,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="served_item" label="Item Name" value={editData?.served_item} onChange={handleInputChange} variant='outlined' sx={{ border: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'item_price', label: 'Price', options: {sort: true, filter: false,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="item_price" label="Price" value={editData?.item_price} onChange={handleInputChange} variant='outlined' sx={{ border: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'item_category', label: 'Item Category', options: {sort: true, filter: true} },
        {
            name: 'Actions',
            options: {
                customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                    if (editRow === tableMeta.rowIndex) {
                        return (
                            <span>
                                <IconButton onClick={handleConfirmEdit} sx={{ marginRight: '5px' }}>
                                    <CheckIcon />
                                </IconButton>
                                <IconButton onClick={handleCancelEdit}>
                                    <CloseIcon />
                                </IconButton>
                            </span>
                        );
                    }else{
                        return (
                            <span>
                                <IconButton onClick={() => handleEditRow(tableMeta)} sx={{ marginRight: '5px' }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteRow(tableMeta.rowIndex)}>
                                    <DeleteIcon />
                                </IconButton>
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
        customToolbar: () => {
            return (
                <IconButton onClick={() => setModalOpen(true)}>
                    <AddIcon />
                </IconButton>
            );
        },
    };

    return (
        <div>
            {isLoading ? (
                <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}/>
            ) : (
                <MUIDataTable
                    title={"Menu List"}
                    data={rows}
                    columns={columns}
                    options={options}
                />
            )}
            {modalOpen && <AddMenuModal closeModal={() => setModalOpen(false)} onSubmit={handleAddRow} maxID={0} />}
        </div>
    );
}

export default MenuTable;