import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Box, TextField } from '@mui/material';
import ConfirmationModal from './ConfirmationModal';

interface Row {
    stock_id: number;
    stock_item: string;
    cost: number;
    stock_quantity: number;
    max_amount: number;
}

interface AddInventoryModalProps {
    closeModal: () => void;
    onSubmit: (newRow: Row) => void;
    maxID: number;
}

/**
 * `AddFamilyModal` is a React component that displays a modal for adding a new family.
 * 
 * @remarks
 * This component displays a form for the user to enter the new family's details, including name, category, and description.
 * When the form is submitted, the new family is added to the database and the modal is closed.
 * 
 * @param closeModal - Function to close the modal
 * @param onSubmit - Function to submit the form and add the new family
 * 
 * @returns The rendered `AddFamilyModal` component
 */
const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ closeModal, onSubmit, maxID }) => {
    const [formState, setFormState] = useState<Row>(
        { stock_id: maxID + 1, stock_item: "", cost: 0, stock_quantity: 0, max_amount: 0 }
    );
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(formState);
        if (formState.stock_item !== "" && formState.cost !== 0 && formState.stock_quantity !== 0 && formState.max_amount !== 0) {
            e.preventDefault();
            alert('Form submitted successfully!');
            onSubmit(formState);
            closeModal();
        } else {
            e.preventDefault();
            alert('Please fill out the entire form before submitting.');
            setShowConfirmationModal(false);
        }
    };

    const handleConfirmation = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setShowConfirmationModal(true);
    }

    return (
        <div className='modal-container'>
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
                    <div style={{ display: 'inline-flex', gap: '20px'}}>
                        <button className='btn' onClick={handleConfirmation}>Submit</button>
                        <button className='btn' onClick={() => closeModal()}>Cancel</button>
                    </div>
                </Box>
            </div>
            {showConfirmationModal && <ConfirmationModal closeModal={() => setShowConfirmationModal(false)} submitFunction={handleSubmit}/>}
        </div>
    );
};

export default AddInventoryModal;
