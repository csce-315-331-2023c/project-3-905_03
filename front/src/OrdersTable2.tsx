import React, {useState, useEffect} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';
import axios from 'axios';
import "./Table.css";
import {BsFillTrashFill, BsEyeFill} from 'react-icons/bs'

function OrdersTable2() {
    interface Row {
        employee_id: number;
        order_id: number;
        order_total: string;
        takeout: string;
        split: string;
        order_date: string;
    }

    interface Data {
        data: Row[];
    }

    const columns: TableColumn<Row>[] = [
        {
            name: "Employee ID",
            selector: row => row.employee_id,
            sortable: true
        },
        {
            name: "Order ID",
            selector: row => row.order_id,
            sortable: true
        },
        {
            name: "Order Total",
            selector: row => row.order_total,
            sortable: true
        },
        {
            name: "Takeout",
            selector: row => row.takeout,
            sortable: true
        },
        {
            name: "Split",
            selector: row => row.split,
            sortable: true
        },
        {
            name: "Order Date",
            selector: row => row.order_date,
            sortable: true
        },
        {
            name: "Actions",
            sortable: false,
            cell: (row) => {
                return (
                <span className='actions'>
                    <BsEyeFill className="view-btn"/>
                    <BsFillTrashFill className="delete-btn" onClick={() => handleDeleteRow(row.order_id)}/>
                </span>
                )
            }

        }
    ]

    const [rows, setRows] = useState<any []>([]);
    const [employeeID, setEmployeeID] = useState(-1);
    const [orderID, setOrderID] = useState(-1);
    const [orderTotal, setOrderTotal] = useState('');
    const [takeout, setTakeout] = useState('');
    const [split, setSplit] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [rowToEdit, setRowToEdit] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;

    useEffect(() => {
        axios.get('/getRecentOrders')
        .then(res => {
            const data: Data = res.data;
            const items: Row[] = data.data;
            setRows(items);
        })
        .catch(er => console.log(er));
    }, []);
    
    const handleDeleteRow = (targetIndex: number) => {
        setRows(rows.filter((_, idx) => idx !== targetIndex))
    };
    
    return (
        <div className='table-container'>
            <DataTable columns={columns} data={rows} 
            fixedHeader
            pagination
            highlightOnHover
            pointerOnHover
            theme='default'
            responsive/>
        </div>
    )
}

export default OrdersTable2