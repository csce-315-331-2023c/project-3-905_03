import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Table.css";
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';
import AddInventoryModal from './AddInventoryModal';
import { DataGrid, GridColDef, GridRenderEditCellParams } from '@mui/x-data-grid';
import { Edit } from '@mui/icons-material';

function InventoryTable() {
    const columns: GridColDef[] = [
        {
            field: "stock_id",
            headerName: "Stock ID",
            filterable: false,
            sortable: true,
        },
        {
            field: "stock_item",
            headerName: "Stock Item",
            filterable: false,  
            sortable: true,
        },
        {
            field: "cost",
            headerName: "Cost",
            filterable: false,
            sortable: true,
        },
        {
            field: "stock_quantity",
            headerName: "Stock Quantity",
            filterable: false,
            sortable: true,
        },
        {
            field: "max_amount",
            headerName: "Maximum Amount",
            filterable: false,
            sortable: true,
        },
        {
            field: "actions",
            headerName: "Actions",
            filterable: false,
            sortable: false,
            renderEditCell: (params: GridRenderEditCellParams) => (
                <Edit onClick={() => handleEditRow(params.id as number)} />
            ),
        }
    ]
    interface Row {
        stock_id: number;
        stock_item: string;
        cost: number;
        stock_quantity: number;
        max_amount: number;
    }

    interface Data {
        data: Row[];
    }

    const [rows, setRows] = useState<Row[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [name, setName] = useState<string>('');
    const [cost, setCost] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [maxAmount, setMaxAmount] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    


    const fetchInventoryItems = () => {
        axios.get('/getStockItems')
            .then(res => {
                const data: Data = res.data;
                setRows(data.data);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchInventoryItems();
    }, []);

    const handleDeleteRow = (targetIndex: number) => {
        axios.post('/deleteStockItem', rows[targetIndex])
            .then(() => {
                fetchInventoryItems();  // Refresh items after delete
            })
            .catch(err => console.log(err));
    };

    const handleAddRow = (newRow: Row) => {
        axios.post('/addStockItem', newRow)
            .then(() => {
                fetchInventoryItems(); 
            })
            .catch(err => console.log(err));
    };

    const handleEditRow = (stock_id: number) => {
        const row = rows.find(r => r.stock_id === stock_id);
        if (row) {
            setName(row.stock_item);
            setCost(row.cost);
            setQuantity(row.stock_quantity);
            setMaxAmount(row.max_amount);
            setEditId(stock_id);
        }
    };

    const handleUpdate = () => {
        if (editId === null) return;

        axios.post('/editStockItem', { stock_id: editId, stock_item: name, cost, stock_quantity: quantity, max_amount: maxAmount })
            .then(() => {
                fetchInventoryItems();  
            })
            .catch(err => console.log(err));

        setEditId(null);
        setName('');
        setCost(0);
        setQuantity(0);
        setMaxAmount(0);
    };

    return (
        <div className='table-container'>
            <DataGrid className='table'
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 20, 30]}
                getRowId={(row) => row.stock_id}
            />
            <button className='btn' onClick={() => setModalOpen(true)}>Add New Inventory</button>
            {modalOpen && <AddInventoryModal closeModal={() => setModalOpen(false)} onSubmit={handleAddRow} maxID={0} />}
        </div>
    );
}

export default InventoryTable;

