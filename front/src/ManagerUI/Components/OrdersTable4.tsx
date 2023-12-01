import React, { useState, useEffect } from 'react';
import MUIDataTable, { MUIDataTableMeta } from "mui-datatables";
import axios from 'axios';
import "../Styles/Table.css";
import { BsEyeFill } from 'react-icons/bs';
import ViewOrderModal from '../../ViewOrderModal';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Row {
    employee_id: number;
    order_id: number;
    order_total: string;
    takeout: string;
    split: string;
    order_date: string;
    formatted_order_date: string;
}

function OrdersTable4() {
    const currentDateTime = new Date();
    const oneYearAgo = new Date(currentDateTime.getFullYear() - 1, currentDateTime.getMonth(), currentDateTime.getDate());
    const [startDateTime, setStartDateTime] = useState<Date>(oneYearAgo);
    const [endDateTime, setEndDateTime] = useState<Date>(currentDateTime);
    const [rows, setRows] = useState<Row[]>([]);
    const [modalOpen, setModalOpen] = useState<number | null>(null);

    useEffect(() => {
        axios.get('/getRecentOrders')
            .then(res => {
                const data: Row[] = res.data.data;
                setRows(data);
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

    const columns = [
        { name: 'employee_id', label: 'Employee ID', options: { filter: true, sort: true }},
        { name: 'order_id', label: 'Order ID', options: { filter: true, sort: true, }},
        { name: 'order_total', label: 'Order Total', options: { filter: true, sort: true, }},
        { name: 'takeout', label: 'Takeout', options: { filter: true, sort: true, }},
        { name: 'split', label: 'Split', options: { filter: true, sort: true, }},
        { name: 'formatted_order_date', label: 'Order Date', options: { filter: true, sort: true, }},
        {
            name: 'Actions',
            options: {
                customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                    return (
                        <span className='actions'>
                            <BsEyeFill className="view-btn" onClick={() => setModalOpen(tableMeta.rowData[1])} />
                            {modalOpen === tableMeta.rowData[1] && <ViewOrderModal key={tableMeta.rowData[1]} closeModal={() => setModalOpen(null)} order_id={tableMeta.rowData[1]} />}
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
    };

    return (
        <div className='table-container'>
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
            <MUIDataTable
                title={"Orders"}
                data={rows}
                columns={columns}
                options={options}
            />
        </div>
    );
}
        
        export default OrdersTable4;