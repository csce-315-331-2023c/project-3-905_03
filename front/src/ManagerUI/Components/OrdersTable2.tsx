import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import axios from 'axios';
import "../Styles/Table.css";
import { BsFillTrashFill, BsEyeFill } from 'react-icons/bs';
import ViewOrderModal from '../../ViewOrderModal';

interface Row {
    employee_id: number;
    order_id: number;
    order_total: string;
    takeout: string;
    split: string;
    order_date: string;
    formatted_order_date: string;
}

function OrdersTable2() {
    const [rows, setRows] = useState<Row[]>([]);
    const [modalOpen, setModalOpen] = useState<number | null>(null);
    const [search, setSearch] = useState<string>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        axios.get('/getRecentOrders')
            .then(res => {
                const data: Row[] = res.data.data;
                setRows(data);
            })
            .catch(err => console.log(err));
    }, []);


    const columns: TableColumn<Row>[] = [
        { name: 'Employee ID', selector: row => row.employee_id, sortable: true },
        { name: 'Order ID', selector: row => row.order_id, sortable: true },
        { name: 'Order Total', selector: row => row.order_total, sortable: true },
        { name: 'Takeout', selector: row => row.takeout, sortable: true },
        { name: 'Split', selector: row => row.split, sortable: true },
        { name: 'Order Date', selector: row => row.formatted_order_date, sortable: true },
        {
            name: 'Actions',
            cell: (row) => (
                <span className='actions'>
                    <BsEyeFill className="view-btn" onClick={() => setModalOpen(row.order_id)} />
                    {modalOpen === row.order_id && <ViewOrderModal key={row.order_id} closeModal={() => setModalOpen(null)} order_id={row.order_id} />}
                </span>
            ),
        },
    ];

    const filteredRows = rows.filter(row => 
        row.employee_id.toString().toLowerCase().includes(search) ||
        row.order_id.toString().toLowerCase().includes(search) ||
        row.order_total.toString().toLowerCase().includes(search)
    );

    const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        axios.post('/getOrdersBetweenDates', {start_date: startDate, end_date: endDate})
        .then((res) => {
            const items: Row[] = res.data.data;
            console.log(items);
            setRows(items);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    return (
        <div className='table-container'>
            <input type="text" placeholder="Search by Order ID, Employee ID, or Order Total" onChange={e => setSearch(e.target.value.toLowerCase())} />
            <form>
                    <input type="text" placeholder='Enter Start Date (YYYY-MM-DD)' onChange={e => setStartDate(e.target.value)}/>
                    <input type="text" placeholder='Enter End Date (YYYY-MM-DD)' onChange={e => setEndDate(e.target.value)}/>
                    <button onClick={handleSearch}>Search</button>
            </form>
            <DataTable
                columns={columns}
                data={filteredRows}
                fixedHeader
                pagination
                highlightOnHover
                pointerOnHover
                theme='default'
                responsive
            />
        </div>
    );
}

export default OrdersTable2;