import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Table.css";
import AddFamilyModal from './AddFamilyModal';
import DescriptionModal from './DescriptionModal';
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

interface Row {
    family_id: number;
    family_name: string;
    family_category: string;
    family_description: string;
}

/**
 * `FamilyTable` is a React component that displays a table of families.
 * 
 * @remarks
 * This component fetches family data from the server and displays it in a table.
 * The user can add, edit, and delete families.
 * The table includes columns for the family's ID, name, category, and description.
 * The description can be viewed in a modal.
 * The name and category can be edited directly in the table.
 * 
 * @returns The rendered `FamilyTable` component
 */
function FamilyTable() {
    const [rows, setRows] = useState<Row[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [dModalOpen, setDModalOpen] = useState<number | null>(null);
    const [editRow, setEditRow] = useState<number | null>(null);
    const [editData, setEditData] = useState<Row | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchFamilies = () => {
        axios.get('/getAllFamilies')
            .then(res => {
                const data: Row[] = res.data.data;
                setRows(data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => { fetchFamilies(); }, []);

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
            axios.post('/editFamily', editData)
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
                    family_id: 0,
                    family_name: '',
                    family_category: '',
                    family_description: '',
                };
            }
        });
    };

    const handleDeleteRow = (targetIndex: number) => {
        axios.post('/deleteFamily', rows[targetIndex])
            .then(() => {
                const newRows = [...rows];
                newRows.splice(targetIndex, 1);
                setRows(newRows);
            })
            .catch(err => console.log(err));
    };

    const handleAddRow = (newRow: Row) => {
        axios.post('/addFamily', newRow)
            .then(() => {
                fetchFamilies();
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
                        family_id: 0,
                        family_name: '',
                        family_category: '',
                        family_description: '',
                    };
                }
            });

        }
    }
    
    const columns = [
        { name: 'family_id', label: 'Family ID', options: {sort: true, filter: false} },
        { name: 'family_name', label: 'Family Name', options: {sort: true, filter: false,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="family_name" label="Family Name" value={editData?.family_name} onChange={handleInputChange} variant='outlined' style={{ outline: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'family_category', label: 'Family Category', options: {sort: true, filter: true,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return (
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-select-small-label">Category</InputLabel>
                            <Select
                                name='family_category'
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={editData?.family_category}
                                label="Category"
                                onChange={handleSelectChange}
                            >
                                <MenuItem value="entree">Entree</MenuItem>
                                <MenuItem value="side">Side</MenuItem>
                                <MenuItem value="w&t">Waffle & Toast</MenuItem>
                                <MenuItem value="drink">Drink</MenuItem>
                                <MenuItem value="special">Special</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    );
                }
                return value;
            }} },
        { name: 'family_description', label: 'Description', options: {sort: true, filter: false,
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                return (
                    <span>
                        <IconButton onClick={() => {setDModalOpen(tableMeta.rowData[1])}}>
                            <VisibilityIcon/>
                        </IconButton>
                        {dModalOpen === tableMeta.rowData[1] && <DescriptionModal key={tableMeta.rowData[1]} closeModal={() => {setDModalOpen(null); fetchFamilies();}} family_id={tableMeta.rowData[0]} family_description={tableMeta.rowData[3]}/>}
                    </span>
                );
            }} },
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
                    <IconButton onClick={() => { fetchFamilies(); setIsLoading(true); }} aria-label='Refresh'>
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
                        title={"Family List"}
                        data={rows}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            )}
            {modalOpen && <AddFamilyModal closeModal={() => setModalOpen(false)} onSubmit={handleAddRow} />}
        </div>
    );
}

export default FamilyTable