import React, { useState, ChangeEvent, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, TextField } from '@mui/material';
import ConfirmationModal from './ConfirmationModal';

interface Row {
    family_id: number;
    family_name: string;
    family_category: string;
    family_description: string;
}

interface AddFamilyModalProps {
    closeModal: () => void;
    onSubmit: (newRow: Row) => void;
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
const AddFamilyModal: React.FC<AddFamilyModalProps> = ({ closeModal, onSubmit }) => {
    const [formState, setFormState] = useState<Row>(
        { family_id: 0, family_name: "", family_category: "", family_description: "" }
    );
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        onSubmit(formState);
        closeModal();

    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        const val = event.target.value;
        if (typeof val === 'string'){
            setFormState({
                ...formState,
                family_category: val
            })
        }
    }

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
                        <TextField name="family_name" label="Family Name" value={formState.family_name} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="family_description" multiline label="Family Description" value={formState.family_description} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <FormControl sx={{ m: 1, minWidth: '41.5%' }} size="medium">
                            <InputLabel id="demo-select-small-label">Category</InputLabel>
                            <Select
                                name='family_category'
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={formState.family_category}
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
                    <div style={{ display: 'inline-flex', gap: '20px'}}>
                        <button className='btn' onClick={handleConfirmation}>Submit</button>
                        <button className='btn' onClick={() => closeModal()}>Cancel</button>
                    </div>
                </Box>
            </div>
            {showConfirmationModal && <ConfirmationModal closeModal={() => setShowConfirmationModal(false)} submitFunction={handleSubmit} />}
        </div>
    )
}

export default AddFamilyModal;