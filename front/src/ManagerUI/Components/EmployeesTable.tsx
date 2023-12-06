import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Table.css";
import AddEmployeeModal from './AddEmployeeModal';
import AdditionalInfoModal from './AdditionalInfoModal';
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

interface AdditionalInfo {
    phone: string;
    pay_rate: number;
    alt_email: string;
    preferred_name: string;
    address: string;
    emergency_contact_first_name: string;
    emergency_contact_last_name: string;
    emergency_contact_phone: string;
}

interface Row {
    employee_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    created_at: string;
    formatted_created_at?: string;
    additional_info: AdditionalInfo;

}

/**
 * `EmployeesTable` is a React component that displays a table of employees.
 * 
 * @remarks
 * This component fetches employee data from the server and displays it in a table.
 * The user can add, edit, and delete employees.
 * The table includes columns for the employee's ID, first name, last name, email, role, additional information, and the date the employee was created.
 * 
 * @returns The rendered `EmployeesTable` component
 */
function EmployeesTable() {
    const [rows, setRows] = useState<Row[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [infoModalOpen, setInfoModalOpen] = useState<number | null>(null);
    const [editRow, setEditRow] = useState<number | null>(null);
    const [editData, setEditData] = useState<Row | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchEmployees = () => {
        axios.get('/getEmployees')
            .then(res => {
                const data: Row[] = res.data.data;
                setRows(data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => { fetchEmployees(); }, []);

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
            axios.post('/editEmployee', editData)
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
                    employee_id: 0,
                    first_name: '',
                    last_name: '',
                    email: '',
                    role: '',
                    created_at: '',
                    formatted_created_at: '',
                    additional_info: {
                        phone: '',
                        pay_rate: 0,
                        alt_email: '',
                        preferred_name: '',
                        address: '',
                        emergency_contact_first_name: '',
                        emergency_contact_last_name: '',
                        emergency_contact_phone: '',
                    },
                };
            }
        });
    };

    const handleDeleteRow = (targetIndex: number) => {
        axios.post('/deleteEmployee', rows[targetIndex])
            .then(() => {
                const newRows = [...rows];
                newRows.splice(targetIndex, 1);
                setRows(newRows);
            })
            .catch(err => console.log(err));
    };

    const handleAddRow = (newRow: Row) => {
        axios.post('/addEmployee', newRow)
            .then(() => {
                fetchEmployees();
                })
            .catch(err => console.log(err));
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        const val = event.target.value;
        if (typeof val === 'string'){
            setEditData(prevData => {
                if (prevData) {
                    return { ...prevData, family_category: val };
                } else {
                    return {
                        employee_id: 0,
                        first_name: '',
                        last_name: '',
                        email: '',
                        role: '',
                        created_at: '',
                        formatted_created_at: '',
                        additional_info: {
                            phone: '',
                            pay_rate: 0,
                            alt_email: '',
                            preferred_name: '',
                            address: '',
                            emergency_contact_first_name: '',
                            emergency_contact_last_name: '',
                            emergency_contact_phone: '',
                        },
                    };
                }
            });

        }
    }
    
    const columns = [
        { name: 'employee_id', label: 'Employee ID', options: {sort: true, filter: false} },
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
        { name: 'role', label: 'Role', options: {sort: true, filter: true,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return (
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-select-small-label">Role</InputLabel>
                            <Select
                                name='family_category'
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={editData?.role}
                                label="Role"
                                onChange={handleSelectChange}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="manager">Manager</MenuItem>
                                <MenuItem value="cashier">Cashier</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    );
                }
                return value;
            }} },
        { name: 'additional_info', label: 'Additional Information', options: {sort: false, filter: false,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                return (
                    <span>
                        <IconButton onClick={() => {setInfoModalOpen(tableMeta.rowData[1])}}>
                            <VisibilityIcon/>
                        </IconButton>
                        {infoModalOpen === tableMeta.rowData[1] && <AdditionalInfoModal 
                        key={tableMeta.rowData[1]} 
                        closeModal={() => {setInfoModalOpen(null); fetchEmployees();}} 
                        employee_id={tableMeta.rowData[0]} 
                        additional_info={tableMeta.rowData[5]}/>}
                    </span>
                );
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
                    <IconButton onClick={() => { fetchEmployees(); setIsLoading(true); }} aria-label='Refresh'>
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
                        title={"Employee List"}
                        data={rows}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            )}
            {modalOpen && <AddEmployeeModal closeModal={() => setModalOpen(false)} onSubmit={handleAddRow} />}
        </div>
    )
}

export default EmployeesTable;