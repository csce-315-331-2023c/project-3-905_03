import React, { useState, useEffect } from 'react';
import MUIDataTable, { MUIDataTableMeta } from "mui-datatables";
import axios from 'axios';
import "../Styles/Table.css";
import ViewOrderModal from './ViewOrderModal';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { IconButton } from '@mui/material';
import {Popover, Box} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface Row {
    employee_id: number;
    order_id: number;
    order_total: string;
    takeout: string;
    order_date: string;
    formatted_order_date: string;
    status: string;
}

function OrdersTable4() {
    const currentDateTime = new Date();
    const oneYearAgo = new Date(currentDateTime.getFullYear() - 1, currentDateTime.getMonth(), currentDateTime.getDate());
    const [startDateTime, setStartDateTime] = useState<Date>(oneYearAgo);
    const [endDateTime, setEndDateTime] = useState<Date>(currentDateTime);
    const [rows, setRows] = useState<Row[]>([]);
    const [modalOpen, setModalOpen] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
                if (value === "fulfilled") {
                    return (
                        <span>
                            <TaskAltIcon style={{ color: 'green' }}/>
                        </span>
                    );
                } else if (value === "cancelled") {
                    return (
                        <span>
                            <HighlightOffIcon style={{ color: 'red' }}/>
                        </span>
                    );
                } else if (value === "pending") {
                    return (
                        <span>
                            <RadioButtonUncheckedIcon style={{ color: 'orange' }}/>
                        </span>
                    );
                }
            }
        }},
        {
            name: 'Actions',
            options: {
                customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                    return (
                        <span>
                            <IconButton onClick={() => setModalOpen(tableMeta.rowData[1])}>
                                <VisibilityIcon/>
                            </IconButton>
                            <IconButton onClick={() => deleteOrder(tableMeta.rowData[1])}>
                                <DeleteIcon/>
                            </IconButton>
                            {modalOpen === tableMeta.rowData[1] && <ViewOrderModal key={tableMeta.rowData[1]} closeModal={() => setModalOpen(null)} order_id={tableMeta.rowData[1]} openParentModal={() => setModalOpen(tableMeta.rowData[1])}/>}
                        </span>
                    );
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