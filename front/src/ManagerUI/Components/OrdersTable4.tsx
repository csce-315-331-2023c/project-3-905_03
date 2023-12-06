import React, { useState, useEffect } from 'react';
import MUIDataTable, { MUIDataTableMeta } from "mui-datatables";
import axios from 'axios';
import "../Styles/Table.css";
import ViewOrderModal from './ViewOrderModal';
import EditOrderModal from './EditOrderModal';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, TableCell, Typography } from '@mui/material';
import {Popover, Box} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface Row {
    employee_id: number;
    order_id: number;
    order_total: string;
    takeout: string;
    order_date: string;
    formatted_order_date: string;
    status: string;
}

/**
 * `OrdersTable4` is a React component that displays a table of orders.
 * 
 * @remarks
 * This component fetches recent orders from the server and displays them in a table.
 * The user can search for orders between specific dates, refresh the orders, view an order, edit an order, and delete an order.
 * The table includes columns for the employee ID, order ID, order total, whether the order is for takeout, the order date, the order status, and actions.
 * The order status can be edited directly in the table.
 * 
 * @returns The rendered `OrdersTable4` component
 */
function OrdersTable4() {
    const currentDateTime = new Date();
    const oneYearAgo = new Date(currentDateTime.getFullYear() - 1, currentDateTime.getMonth(), currentDateTime.getDate());
    const [startDateTime, setStartDateTime] = useState<Date>(oneYearAgo);
    const [endDateTime, setEndDateTime] = useState<Date>(currentDateTime);
    const [rows, setRows] = useState<Row[]>([]);
    const [modalOpen, setModalOpen] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editOrderModalOpen, setEditOrderModalOpen] = useState<number | null>(null);
    const [editRow, setEditRow] = useState<number | null>(null);
    const [editData, setEditData] = useState< Row | null>(null);

    useEffect(() => {
        axios.get('/getRecentOrders')
            .then(res => {
                const data: Row[] = res.data.data;
                setRows(data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }, []);

    const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        axios.post('/getOrdersBetweenDates', {start_date: startDateTime, end_date: endDateTime})
        .then((res) => {
            const items: Row[] = res.data.data;
            console.log(items);
            setRows(items);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    const refreshOrders = () => {   
        axios.get('/getRecentOrders')
            .then(res => {
                const data: Row[] = res.data.data;
                setRows(data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }

    const deleteOrder = (order_id: number) => {
        axios.post('/deleteOrder', {order_id: order_id})
            .then(() => {
                refreshOrders();
            })
            .catch(err => console.log(err));
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCancelEdit = () => {
        setEditRow(null);
        setEditData(null);
    };

    const handleConfirmEdit = () => {
        if (editData) {
            axios.post('/changeOrderStatus', {order_id: editData.order_id, status: editData.status})
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

    const handleSelectChange = (event: SelectChangeEvent) => {
        const val = event.target.value;
        if (typeof val === 'string'){
            setEditData(prevData => {
                if (prevData) {
                    return { ...prevData, status: val };
                } else {
                    return {
                        employee_id: 0,
                        order_id: 0,
                        order_total: '',
                        takeout: '',
                        order_date: '',
                        formatted_order_date: '',
                        status: ''
                    };
                }
            });

        }
    }

    const handleEditRow = (tableMeta: MUIDataTableMeta) => {
        setEditRow(tableMeta.rowIndex);
        setEditData(rows[tableMeta.rowIndex]);
    };
    
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const columns = [
        { name: 'employee_id', label: 'Employee ID', options: { filter: true, sort: true }},
        { name: 'order_id', label: 'Order ID', options: { filter: false, sort: true, }},
        { name: 'order_total', label: 'Order Total', options: { filter: false, sort: true, }},
        { name: 'takeout', label: 'Takeout', options: { filter: true, sort: true, }},
        { name: 'formatted_order_date', label: 'Order Date', options: { filter: false, sort: true, }},
        { name: 'status', label: 'Order Status', options: { filter: true, sort: true, 
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return (
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-select-small-label">Status</InputLabel>
                            <Select
                                name='status'
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={editData?.status}
                                label="Status"
                                onChange={handleSelectChange}
                            >
                                <MenuItem value='fulfilled'>
                                    <Box display='flex' alignItems='center'>
                                        <TaskAltIcon style={{ color: 'green' }}/>
                                        <Typography variant="body1" style={{ marginLeft: '5px' }}>
                                            - Fulfilled
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value='pending'>
                                    <Box display='flex' alignItems='center'>
                                        <RadioButtonUncheckedIcon style={{ color: 'orange' }}/>
                                        <Typography variant="body1" style={{ marginLeft: '5px' }}>
                                            - Pending
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value='cancelled'>
                                    <Box display='flex' alignItems='center'>
                                        <HighlightOffIcon style={{ color: 'red' }}/>
                                        <Typography variant="body1" style={{ marginLeft: '5px' }}>
                                            - Cancelled
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    );
                } else {
                    if (value === "fulfilled") {
                        return (
                            <span title='Fulfilled'>
                                <IconButton onClick={() => handleEditRow(tableMeta)}>
                                    <TaskAltIcon style={{ color: 'green' }}/>
                                </IconButton>
                            </span>
                        );
                    } else if (value === "cancelled") {
                        return (
                            <span title='Cancelled'>
                                <IconButton onClick={() => handleEditRow(tableMeta)}>
                                    <HighlightOffIcon style={{ color: 'red' }}/>
                                </IconButton>
                            </span>
                        );
                    } else if (value === "pending") {
                        return (
                            <span title='Pending'>
                                <IconButton onClick={() => handleEditRow(tableMeta)}>
                                    <RadioButtonUncheckedIcon style={{ color: 'orange' }}/>
                                </IconButton>
                            </span>
                        );
                    }
                }
            },
        }},
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
                    } else {
                        return (
                            <span>
                                <IconButton onClick={() => setModalOpen(tableMeta.rowData[1])}>
                                    <VisibilityIcon/>
                                </IconButton>
                                <IconButton onClick={() => setEditOrderModalOpen(tableMeta.rowData[1])}>
                                    <EditIcon/>
                                </IconButton>
                                <IconButton onClick={() => deleteOrder(tableMeta.rowData[1])}>
                                    <DeleteIcon/>
                                </IconButton>
                                {modalOpen === tableMeta.rowData[1] && <ViewOrderModal 
                                key={tableMeta.rowData[1]} 
                                closeModal={() => setModalOpen(null)} 
                                order_id={tableMeta.rowData[1]} 
                                openParentModal={() => setModalOpen(tableMeta.rowData[1])}/>}
                                {editOrderModalOpen === tableMeta.rowData[1] && <EditOrderModal 
                                key={tableMeta.rowData[1]} 
                                closeModal={() => setEditOrderModalOpen(null)} 
                                orderID={tableMeta.rowData[1]} 
                                getOrders={() => refreshOrders()}/>}
                            </span>
                        );
                    }
                },
                filter: false,
                sort: false,
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
                    <IconButton aria-describedby={id} onClick={handleClick}>
                        <DateRangeIcon/>
                    </IconButton>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Box p={2}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Start Date & Time"
                                    value={startDateTime}
                                    onChange={(value: Date | null) => setStartDateTime(value || new Date())}
                                />
                                <DateTimePicker
                                    label="End Date & Time"
                                    value={endDateTime}
                                    onChange={(value: Date | null) => setEndDateTime(value || new Date())}
                                />
                            </LocalizationProvider>
                            <button onClick={handleSearch}>Search</button>
                        </Box>
                    </Popover>
                    <IconButton onClick={() => { refreshOrders(); setIsLoading(true); }} aria-label='Refresh'>
                        <RefreshIcon/>
                    </IconButton>
                </div>
            );
        },
    };

    return (
        <div className='table-container'>
            {isLoading ? (
                <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}/>
            ) : (
                <MUIDataTable
                    title={"Orders"}
                    data={rows}
                    columns={columns}
                    options={options}
                />
            )}
        </div>
    );
}
        
        export default OrdersTable4;