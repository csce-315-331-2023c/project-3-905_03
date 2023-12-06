import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Table.css";
import AddInventoryModal from './AddInventoryModal';
import ConfirmationModal from './ConfirmationModal';
import MUIDataTable, { MUIDataTableMeta } from "mui-datatables";
import { TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import RefreshIcon from '@mui/icons-material/Refresh';
import { createTheme, ThemeProvider } from '@mui/material/styles';


interface Row {
    stock_id: number;
    stock_item: string;
    cost: number;
    stock_quantity: number;
    max_amount: number;
}

/**
 * `InventoryTable2` is a React component that displays a table of inventory items.
 * 
 * @remarks
 * This component fetches inventory data from the server and displays it in a table.
 * The user can add, edit, and delete inventory items.
 * The table includes columns for the item's stock ID, name, cost, quantity, and maximum amount.
 * The name, cost, quantity, and maximum amount can be edited directly in the table.
 * 
 * @returns The rendered `InventoryTable2` component
 */
function InventoryTable2() {
    const [rows, setRows] = useState<Row[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editRow, setEditRow] = useState<number | null>(null);
    const [editData, setEditData] = useState<Row | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
    const [deleteRowIndex, setDeleteRowIndex] = useState<number>(-1);

    const fetchInventoryItems = () => {
        axios.get('/getStockItems')
            .then(res => {
                const data: Row[] = res.data.data;
                setRows(data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => { fetchInventoryItems(); }, []);

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

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        handleDeleteRow(deleteRowIndex);
        setShowConfirmationModal(false);
    }

    const handleAddRow = (newRow: Row) => {
        axios.post('/addStockItem', newRow)
            .then(() => {
                fetchInventoryItems();
            })
            .catch(err => console.log(err));
    };
    
    const columns = [
        { name: 'stock_id', label: 'Stock ID', options: {sort: true, filter: false} },
        { name: 'stock_item', label: 'Stock Item', options: {sort: true, filter: false,
            // @ts-ignore
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="stock_item" label="Stock Item" value={editData?.stock_item} onChange={handleInputChange} variant='outlined' style={{ outline: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'cost', label: 'Cost', options: {sort: true, filter: false,
            // @ts-ignore
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="cost" label="Cost" value={editData?.cost} onChange={handleInputChange} variant='outlined' style={{ outline: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'stock_quantity', label: 'Quantity', options: {sort: true, filter: false,
            // @ts-ignore
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="stock_quantity" label="Stock Quantity" value={editData?.stock_quantity} onChange={handleInputChange} variant='outlined' style={{ outline: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'max_amount', label: 'Maximum Amount', options: {sort: true, filter: false,
            // @ts-ignore
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="max_amount" label="Maximum Amount" value={editData?.max_amount} onChange={handleInputChange} variant='outlined' style={{ outline: 'none' }}/>;
                }
                return value;
            }} },
        {
            name: 'Actions',
            options: {
                // @ts-ignore
                customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                    if (editRow === tableMeta.rowIndex) {
                        return (
                            <span>
                                <IconButton onClick={handleConfirmEdit}>
                                    <CheckIcon/>
                                </IconButton>
                                <IconButton onClick={handleCancelEdit}>
                                    <CloseIcon/>
                                </IconButton>
                            </span>
                        );
                    }else{
                        return (
                            <span>
                                <IconButton onClick={() => handleEditRow(tableMeta)}>
                                    <EditIcon/>
                                </IconButton>
                                <IconButton onClick={() => {setShowConfirmationModal(true); setDeleteRowIndex(tableMeta.rowIndex)}}>
                                    <DeleteIcon/>
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
        selectableRows: 'none' as const,
        page: currentPage,
        onChangePage: (currentPage: number) => setCurrentPage(currentPage),
        customToolbar: () => {
            return (
                <div>
                    <IconButton onClick={() => setModalOpen(true)}>
                        <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => { fetchInventoryItems(); setIsLoading(true); }} aria-label='Refresh'>
                        <RefreshIcon/>
                    </IconButton>
                </div>
            );
        },
    };

    const getMuiTheme = () => createTheme({
        components: {
            MUIDataTableBodyCell: {
            // styleOverrides:{
            //     root: {
            //         backgroundColor: "#F7EEDE"
            //     }
            // }
            }
        }
    })

    return (
        <div className='table-container'>
            {isLoading ? (
                <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}/>
            ) : (
                <ThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title={"Inventory List"}
                        data={rows}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            )}
            {modalOpen && <AddInventoryModal closeModal={() => setModalOpen(false)} onSubmit={handleAddRow} maxID={0} />}
            {showConfirmationModal && <ConfirmationModal closeModal={() => setShowConfirmationModal(false)} submitFunction={handleDelete} delete={true}/>}
        </div>
    );
}

export default InventoryTable2;