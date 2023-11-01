import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "./Table.css";
import {BsFillTrashFill, BsEyeFill} from 'react-icons/bs'

function OrdersTable() {
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
        axios.get('http://localhost:8080/getRecentOrders')
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
            <div className='form-div'>
                <form>
                    <input type="text" placeholder='Enter Start Date (YYYY-MM-DD)' onChange={e => setStartDate(e.target.value)}/>
                    <input type="text" placeholder='Enter End Date (YYYY-MM-DD)' onChange={e => setEndDate(e.target.value)}/>
                    <button>Search</button>
                </form>
            </div>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Order ID</th>
                        <th>Order Total</th>
                        <th>Takeout</th>
                        <th>Split</th>
                        <th className='expand'>Order Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rows.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row.employee_id}</td>
                                <td>{row.order_id}</td>
                                <td>{row.order_total}</td> 
                                <td>{row.takeout}</td>
                                <td>{row.split}</td>
                                <td className='expand'>{row.order_date}</td>
                                <td>
                                    <span className='actions'>
                                        <BsEyeFill className="view-btn"/>
                                        <BsFillTrashFill className="delete-btn" onClick={() => handleDeleteRow(idx)}/>
                                    </span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default OrdersTable