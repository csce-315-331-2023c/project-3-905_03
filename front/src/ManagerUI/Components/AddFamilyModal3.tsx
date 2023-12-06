import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
 * `AddFamilyModal3` is a React component that displays a modal for adding a new family.
 * 
 * @remarks
 * This component displays a form for the user to enter the new family's details, including name, category, and description.
 * The user can select a category from a dropdown.
 * When the form is submitted, the new family is added to the database and the modal is closed.
 * 
 * @param closeModal - Function to close the modal
 * @param onSubmit - Function to submit the form and add the new family
 * 
 * @returns The rendered `AddFamilyModal3` component
 */
const AddFamilyModal3: React.FC<AddFamilyModalProps> = ({ closeModal, onSubmit }) => {
    const [formState, setFormState] = useState<Row>(
        { family_id: 0, family_name: "", family_category: "", family_description: "" }
    );


    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleFormChange2 = (e: ChangeEvent<HTMLTextAreaElement>) => {
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

    return (
        <div className='modal-container'
            onClick={(e) => {
                const target = e.target as HTMLTextAreaElement;
                if (target.className === "modal-container") closeModal();
            }}>
            <div className='modal'>
                <form action="">
                    <div className='form-group'>
                        <label htmlFor="family_name" className='form-label'>Family Name</label>
                        <input name="family_name" type="text" value={formState.family_name} onChange={handleFormChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="family_description" className='form-label'>Family Description</label>
                        <textarea name="family_description" value={formState.family_description} onChange={handleFormChange2} />
                    </div>
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
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
                    <button className='btn' onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default AddFamilyModal3;