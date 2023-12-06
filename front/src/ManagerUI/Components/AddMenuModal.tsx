import React, { useState, useEffect } from 'react';
import axios from 'axios'
import "../Styles/AddMenuModal.css";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, Checkbox, ListItemText, OutlinedInput, TextField } from '@mui/material';
import ConfirmationModal from './ConfirmationModal';

interface Row {
    item_id: number;
    served_item: string;
    item_price: number;
    item_category: string;
    family_name: string;
}

interface stockData {
    data: Array<{ stock_item: string }>
}

interface AddMenuModalProps {
    closeModal: () => void
    onSubmit: (newRow: Row) => void
    maxID: number
}

/**
 * `AddMenuModal` is a React component that displays a modal for adding a new menu item.
 * 
 * @remarks
 * This component displays a form for the user to enter the new menu item's details, including name, price, ingredients, category, and family.
 * The user can select ingredients from a dropdown.
 * The category and family are also selected from dropdowns.
 * When the form is submitted, the new menu item is added to the database and the modal is closed.
 * 
 * @param closeModal - Function to close the modal
 * @param onSubmit - Function to submit the form and add the new menu item
 * @param maxID - The maximum ID of the existing menu items
 * 
 * @returns The rendered `AddMenuModal` component
 */
const AddMenuModal: React.FC<AddMenuModalProps> = ({ closeModal, onSubmit, maxID }) => {
    const [options, setOptions] = useState<any[]>([])
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [formState, setFormState] = useState(
        { item_id: ++maxID, served_item: "", item_price: 0, item_category: "", family_name: ""}
    )
    const [familyMenu, setFamilyMenu] = useState<string | null>(null);
    const [familyOptions, setFamilyOptions] = useState<string[]>([]);
    const [category, setCategory] = useState('');
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);



    useEffect(() => {
        axios.get('/getStockItems')
            .then(res => {
                const data: stockData = res.data;
                const stockitems: string[] = data.data.map(item => item.stock_item)
                setOptions(stockitems)
            })
            .catch(er => console.log(er));
    }, []);


    const handleIngredientsChange = (event: SelectChangeEvent<typeof selectedOptions>) => {
        setSelectedOptions(event.target.value as typeof selectedOptions);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (formState.served_item !== "" && formState.item_price !== 0 && formState.item_category !== "" && formState.family_name !== "" && selectedOptions.length != 0) {
            e.preventDefault();
            alert('Form submitted successfully!');
            onSubmit(formState);
            
            const axiosRequests = selectedOptions.map(selectedOption =>
                axios.post('/addServedItemStockItem', { stock_item: selectedOption })
            );
            Promise.all(axiosRequests)
                .then(() => {
                    closeModal();
                })
                .catch(error => {
                    console.error('Error sending requests:', error);
                });
        } else {
            e.preventDefault();
            alert('Please fill out the entire form before submitting.');
            setShowConfirmationModal(false);
        }
        
    }

    const handleChange = (event: SelectChangeEvent) => {
        const val = event.target.value;
        if (typeof val === 'string'){
            setCategory(val);
            setFamilyMenu(val);
            axios.post('/getFamilies', ({ family_category: val })
            ).then(res => {
                const familyNames: string[] = res.data.data.map((item: { family_name: string }) => item.family_name);
                setFamilyOptions(familyNames);
            })
                .catch(er => console.log(er));
        }
    };

    const handleChange2 = (event: SelectChangeEvent) => {
        setFormState({
            ...formState,
            family_name: (event.target.value as string)
        });
    };

    const handleConfirmation = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setShowConfirmationModal(true);
    }

    return (
        <div className='modal-container'
            onClick={(e) => {
                const target = e.target as HTMLTextAreaElement
                if (target.className === "modal-container") closeModal();
            }}>
            <div className='modal'>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    >
                    <div>
                        <TextField name="served_item" label="Item Name" value={formState.served_item} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="item_price" label="Price" value={formState.item_price} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <FormControl sx={{ m: 1, minWidth: '41.5%' }} size="small">
                            <InputLabel id="demo-multiple-checkbox-label">Select Ingredients</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={selectedOptions}
                                onChange={handleIngredientsChange}
                                input={<OutlinedInput label="Select Ingredients" />}
                                renderValue={(selected) => (selected as string[]).join(', ')}
                                >
                                {options.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        <Checkbox checked={selectedOptions.indexOf(option) > -1} />
                                        <ListItemText primary={option} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-select-small-label">Category</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={category}
                                label="Category"
                                onChange={handleChange}
                            >
                                <MenuItem value="entree">Entree</MenuItem>
                                <MenuItem value="side">Side</MenuItem>
                                <MenuItem value="w&t">Waffle & Toast</MenuItem>
                                <MenuItem value="drink">Drink</MenuItem>
                                <MenuItem value="special">Special</MenuItem>
                            </Select>
                        </FormControl>
                        {familyMenu && (
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                <InputLabel id="demo-select-small-label">Family</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={formState.family_name}
                                    label="Family"
                                    onChange={handleChange2}
                                >
                                    {familyOptions.map((familyOption, idx) => (
                                        <MenuItem key={idx} value={familyOption}>{familyOption}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        <div style={{ display: 'inline-flex', gap: '20px'}}>
                            <button className='btn' onClick={handleConfirmation}>Submit</button>
                            <button className='btn' onClick={() => closeModal()}>Cancel</button>
                        </div>
                    </div>
                </Box>
            </div>
            {showConfirmationModal && <ConfirmationModal closeModal={() => setShowConfirmationModal(false)} submitFunction={handleSubmit}/> }
        </div>
    )
}

export default AddMenuModal