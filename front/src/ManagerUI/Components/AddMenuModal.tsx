import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios'
import { Multiselect } from 'multiselect-react-dropdown';
import "../Styles/AddMenuModal.css";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, TextField } from '@mui/material';

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

const AddMenuModal: React.FC<AddMenuModalProps> = ({ closeModal, onSubmit, maxID }) => {
    const [options, setOptions] = useState<any[]>([])
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [formState, setFormState] = useState(
        { item_id: ++maxID, served_item: "", item_price: 0, item_category: "", family_name: ""}
    )
    const [familyMenu, setFamilyMenu] = useState<string | null>(null);
    const [familyOptions, setFamilyOptions] = useState<string[]>([]);
    const [category, setCategory] = useState('');



    useEffect(() => {
        axios.get('/getStockItems')
            .then(res => {
                const data: stockData = res.data;
                const stockitems: string[] = data.data.map(item => item.stock_item)
                setOptions(stockitems)
            })
            .catch(er => console.log(er));
    }, []);

    const handleSelectChange = (selectedIngredients: any[]) => {
        setSelectedOptions(selectedIngredients);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        onSubmit(formState)
        const axiosRequests = selectedOptions.map(selectedOption =>
            axios.post('/addServedItemStockItem', { stock_item: selectedOption })
        );
        Promise.all(axiosRequests)
            .then(responses => {
                closeModal();
            })
            .catch(error => {
                console.error('Error sending requests:', error);
            });
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
                        <Multiselect isObject={false} options={options} className='ingredient-select' onSelect={handleSelectChange} onRemove={handleSelectChange}/>
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
                            <div className='form-group'>
                                <label htmlFor="Assign Family" className='form-label'>Assign Family</label>
                                
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '5px'}}>
                            <button className='btn' onClick={handleSubmit}>Submit</button>
                            <button className='btn' onClick={() => closeModal()}>Cancel</button>
                        </div>
                    </div>
                </Box>
            </div>
        </div>
    )
}

export default AddMenuModal