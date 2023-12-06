import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/Table.css";
import AddMenuModal from './AddMenuModal';
import MUIDataTable, { MUIDataTableMeta } from "mui-datatables";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { Checkbox, ListItemText, OutlinedInput, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import RefreshIcon from '@mui/icons-material/Refresh';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Row {
    item_id: number;
    served_item: string;
    item_price: number;
    family_id?: number;
    family_name: string;
    ingredients?: string[];
}

/**
 * `MenuTable` is a React component that displays a table of menu items.
 * 
 * @remarks
 * This component fetches menu items, item families, and ingredients from the server and displays them in a table.
 * The user can add, edit, and delete menu items.
 * The table includes columns for the item's ID, name, price, family name, and ingredients.
 * The name, price, family name, and ingredients can be edited directly in the table.
 * 
 * @returns The rendered `MenuTable` component
 */
function MenuTable() {
    const [rows, setRows] = useState<Row[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editRow, setEditRow] = useState<number | null>(null);
    const [editData, setEditData] = useState<Row | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [familyNames, setFamilyNames] = useState<string[]>([]);
    const [allIngredients, setAllIngredients] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);


    const fetchMenuItems = () => {
        Promise.all([
            axios.get('/getServedItems'),
            // axios.get('/getItemCategories')
        ])
        .then(([servedItemsRes]) => {
            const servedItemsData: Row[] = servedItemsRes.data.data.map((item: any) => ({
                ...item,
                ingredients: item.ingredients.map((ingredient: any) => ingredient.stock_item),
            }));
            const familyCategoryPromises = servedItemsData.map((item) =>
                axios.post('/getItemFamily', {family_id: item.family_id})
            );
    
            Promise.all(familyCategoryPromises)
                .then((familyCategories) => {
                    const data = servedItemsData.map((item, index) => ({
                        ...item,
                        family_name: familyCategories[index].data.data.family_name,
                    }));

                    setRows(data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching family categories:', error);
                    // Handle the error appropriately
                });
        })
        .catch((error) => {
            console.error('Error fetching served items:', error);
            // Handle the error appropriately
        });
    }
    const fetchAllIngredients = () => {
        axios.get('/getStockItems')
            .then((res) => {
                const data: Array<{ stock_item: string }> = res.data.data;
                const ingredientNames: string[] = data.map(item => item.stock_item);
                setAllIngredients(ingredientNames);
            })
            .catch(err => console.log(err));
    };

    const fetchItemFamilies = () => {
        axios.get('/getAllFamilies')
            .then((res) => {
                const data: Array<{ family_name: string }> = res.data.data;
                const familyNames: string[] = data.map(item => item.family_name);
                setFamilyNames(familyNames);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => { fetchMenuItems(); fetchItemFamilies(); fetchAllIngredients(); }, []);

    const handleDeleteRow = (targetIndex: number) => {
        axios.post('/deleteServedItem', rows[targetIndex])
            .then(() => {
                const newRows = [...rows];
                newRows.splice(targetIndex, 1);
                setRows(newRows);
            })
            .catch(err => console.log(err));
    };

    const handleAddRow = (newRow: Row) => {
        axios.post('/addServedItem', newRow)
            .then(() => {
                fetchMenuItems();
                fetchAllIngredients();
            })
            .catch(err => console.log(err));
    };

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
            axios.post('/editServedItem', editData)
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
                    item_id: 0, // default value
                    served_item: '', // default value
                    item_price: 0, // default value
                    family_id: 0, // default value
                    family_name: '', // default value
                    ingredients: [],
                };
            }
        });
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        const val = event.target.value;
        if (typeof val === 'string'){
            setEditData(prevData => {
                if (prevData) {
                    return { ...prevData, family_name: val };
                } else {
                    return {
                        item_id: 0, // default value
                        served_item: '', // default value
                        item_price: 0, // default value
                        family_id: 0, // default value
                        family_name: '', // default value
                        ingredients: [],
                    };
                }
            });

        }
    }

    const handleIngredientsChange = (event: SelectChangeEvent<string[]>) => {
        const val = event.target.value as unknown as string[];
        setEditData(prevData => {
            if (prevData) {
                return { ...prevData, ingredients: val };
            } else {
                return {
                    item_id: 0, // default value
                    served_item: '', // default value
                    item_price: 0, // default value
                    family_id: 0, // default value
                    family_name: '', // default value
                    ingredients: [],
                };
            }
        });
    }

    const columns = [
        { name: 'item_id', label: 'Item ID', options: {sort: true, filter: false} },
        { name: 'served_item', label: 'Item Name', options: {sort: true, filter: false,
            // @ts-ignore
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="served_item" label="Item Name" value={editData?.served_item} onChange={handleInputChange} variant='outlined' sx={{ border: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'item_price', label: 'Price', options: {sort: true, filter: false,
            // @ts-ignore
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return <TextField name="item_price" label="Price" value={editData?.item_price} onChange={handleInputChange} variant='outlined' sx={{ border: 'none' }}/>;
                }
                return value;
            }} },
        { name: 'family_name', label: 'Family Name', options: {sort: true, filter: true,
            // @ts-ignore
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return (
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-select-small-label">Family Name</InputLabel>
                            <Select
                                name='family_name'
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={editData?.family_name}
                                label="Family"
                                onChange={handleSelectChange}
                            >
                                {familyNames.map((familyName, index) => (
                                    <MenuItem key={index} value={familyName}>{familyName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    );
                }
                return value;
            }} },
        { name: 'ingredients', label: 'Ingredients', options: {sort: true, filter: true,
            // @ts-ignore
            customBodyRender: (value: any, tableMeta: MUIDataTableMeta, updateValue: (s: any) => any) => {
                if (editRow === tableMeta.rowIndex) {
                    return (
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-multiple-checkbox-label">Ingredients</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={editData?.ingredients || []}
                            onChange={handleIngredientsChange}
                            input={<OutlinedInput label="Ingredients" />}
                            renderValue={(selected) => (selected as string[]).join(', ')}
                            >
                            {allIngredients.map((ingredient) => (
                                <MenuItem key={ingredient} value={ingredient}>
                                    <Checkbox checked={(editData?.ingredients || []).indexOf(ingredient) > -1} />
                                    <ListItemText primary={ingredient} />
                                </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                    </div>
                    );
                }
                return value.join(', ');
            }} },
        {
            name: 'Actions',
            options: {
                // @ts-ignore
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
                    }else{
                        return (
                            <span>
                                <IconButton onClick={() => handleEditRow(tableMeta)} sx={{ marginRight: '5px' }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteRow(tableMeta.rowIndex)}>
                                    <DeleteIcon />
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
        selectableRows: 'none' as const,
        page: currentPage,
        onChangePage: (currentPage: number) => setCurrentPage(currentPage),
        customToolbar: () => {
            return (
                <div>
                    <IconButton onClick={() => setModalOpen(true)}>
                        <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => { fetchMenuItems(); fetchAllIngredients(); setIsLoading(true); }} aria-label='Refresh'>
                        <RefreshIcon/>
                    </IconButton>
                </div>
            );
        },
    };

    return (
        <div>
            {isLoading ? (
                <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}/>
            ) : (
                <MUIDataTable
                    title={"Menu List"}
                    data={rows}
                    columns={columns}
                    options={options}
                />
            )}
            {modalOpen && <AddMenuModal closeModal={() => setModalOpen(false)} onSubmit={handleAddRow} maxID={0} />}
        </div>
    );
}

export default MenuTable;

