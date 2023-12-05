import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { Multiselect } from 'multiselect-react-dropdown';
import { Box, TextField } from '@mui/material';

interface Row {
    stock_id: number;
    stock_item: string;
    cost: number;
    stock_quantity: number;
    max_amount: number;
}

interface relatedItemData {
    data: Array<{ related_item: string }>
}

interface AddInventoryModalProps {
    closeModal: () => void;
    onSubmit: (newRow: Row) => void;
    maxID: number;
}

const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ closeModal, onSubmit, maxID }) => {
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [formState, setFormState] = useState<Row>(
        { stock_id: maxID + 1, stock_item: "", cost: 0, stock_quantity: 0, max_amount: 0 }
    );

    useEffect(() => {
        axios.get('/getRelatedItems')
            .then(res => {
                const relatedItems: string[] = res.data.data.map((item: { related_item: string }) => item.related_item);

                setOptions(relatedItems);
            })
            .catch(err => console.log(err));
    }, []);

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: name === "stock_item" ? value : parseFloat(value)
        });
    };

    const handleSelectChange = (selectedList: any) => {
        setSelectedOptions(selectedList);
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        onSubmit(formState);

        const axiosRequests = selectedOptions.map(selectedOption =>
            axios.post('/addStockItemRelatedItem', { stock_item: formState.stock_item, related_item: selectedOption })
        );

        Promise.all(axiosRequests)
            .then(() => {
                closeModal();
            })
            .catch(error => {
                console.error('Error sending requests:', error);
            });
    };

    return (
        <div className='modal-container'
            onClick={(e) => {
                const target = e.target as HTMLTextAreaElement;
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
                        <TextField name="stock_item" label="Item Name" value={formState.stock_item} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="cost" label="Cost" value={formState.cost} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="stock_quantity" label="Quantity" value={formState.stock_quantity} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="max_amount" label="Maximum Amount" value={formState.max_amount} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                    </div>
                    <button className='btn' onClick={handleSubmit}>Submit</button>
                </Box>
            </div>
        </div>
    );
};

export default AddInventoryModal;
