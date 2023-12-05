import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Table.css";
import AddCustomerModal from './AddCustomerModal';
import MUIDataTable, { MUIDataTableMeta } from "mui-datatables";
import { TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Row {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    formatted_created_at?: string;
}

function CustomersTable() {
    const [rows, setRows] = useState<Row[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editRow, setEditRow] = useState<number | null>(null);
    const [editData, setEditData] = useState<Row | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchCustomers = () => {
        axios.get('/getCustomers')
            .then(res => {
                const data: Row[] = res.data.data;
                setRows(data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => { fetchCustomers(); }, []);

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
            axios.post('/editCustomer', editData)
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
                    user_id: 0,
                    first_name: '',
                    last_name: '',
                    email: '',
                    created_at: '',
                    formatted_created_at: '',
                    
                };
            }
        });
    };

    const handleDeleteRow = (targetIndex: number) => {
        axios.post('/deleteCustomer', rows[targetIndex])
            .then(() => {
                const newRows = [...rows];
                newRows.splice(targetIndex, 1);
                setRows(newRows);
            })
            .catch(err => console.log(err));
    };

    const handleAddRow = (newRow: Row) => {
        axios.post('/addCustomer', newRow)
            .then(() => {
                fetchCustomers();
                })
            .catch(err => console.log(err));
    };
    
    const columns = [
        { name: 'user_id', label: 'Customer ID', options: {sort: true, filter: false} },
        { name: 'first_name', label: 'First Name', options: {sort: true, filter: false,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="first_name" label="First Name" value={editData?.first_name} onChange={handleInputChange} variant='outlined' style={{ outline: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'last_name', label: 'Last Name', options: {sort: true, filter: true,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="last_name" label="Last Name" value={editData?.last_name} onChange={handleInputChange} variant='outlined' style={{ outline: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'email', label: 'Email', options: {sort: true, filter: false,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="email" label="Email" value={editData?.email} onChange={handleInputChange} variant='outlined' style={{ outline: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'formatted_created_at', label: 'Date Created', options: {sort: true, filter: false} },
        {
            name: 'Actions',
            options: {
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
                                <IconButton onClick={() => handleDeleteRow(tableMeta.rowIndex)}>
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
        customToolbar: () => {
            return (
                <div>
                    <IconButton onClick={() => setModalOpen(true)}>
                        <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => { fetchCustomers(); setIsLoading(true); }} aria-label='Refresh'>
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
                        title={"Customer List"}
                        data={rows}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            )}
            {modalOpen && <AddCustomerModal closeModal={() => setModalOpen(false)} onSubmit={handleAddRow} />}
        </div>
    )
}

export default CustomersTable;