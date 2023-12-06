import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, TextField } from '@mui/material';
import ConfirmationModal from './ConfirmationModal';

interface AdditionalInfo {
    phone: string;
    pay_rate: number;
    alt_email: string;
    preferred_name: string;
    address: string;
    emergency_contact_first_name: string;
    emergency_contact_last_name: string;
    emergency_contact_phone: string;
}

interface Row {
    employee_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    created_at: string;
    additional_info: AdditionalInfo;

}

interface AddEmployeeModalProps {
    closeModal: () => void;
    onSubmit: (newRow: Row) => void;
}

/**
 * `AddEmployeeModal` is a React component that displays a modal for adding a new employee.
 * 
 * @remarks
 * This component displays a form for the user to enter the new employee's details, including first name, last name, email, role, and additional information.
 * When the form is submitted, the new employee is added to the database and the modal is closed.
 * 
 * @param closeModal - Function to close the modal
 * @param onSubmit - Function to submit the form and add the new employee
 * 
 * @returns The rendered `AddEmployeeModal` component
 */
const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ closeModal, onSubmit }) => {
    const [formState, setFormState] = useState<Row>(
        { 
            employee_id: 0,
            first_name: '',
            last_name: '',
            email: '',
            role: '',
            created_at: '',
            additional_info: {
                phone: '',
                pay_rate: 0,
                alt_email: '',
                preferred_name: '',
                address: '',
                emergency_contact_first_name: '',
                emergency_contact_last_name: '',
                emergency_contact_phone: '',
            },
        }
    );
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);


    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleConfirmation = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setShowConfirmationModal(true);
    }

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
                role: val
            })
        }
    }

    return (
         <div className='modal-container' style={{overflowY: 'scroll'}}>
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
                        <TextField name="first_name" label="First Name" value={formState.first_name} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="last_name" label="Last Name" value={formState.last_name} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="email" label="Email" value={formState.email} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <FormControl sx={{ m: 1, minWidth: '41.5%' }} size="medium">
                            <InputLabel id="demo-select-small-label">Assign Role</InputLabel>
                            <Select
                                name='role'
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={formState.role}
                                label="Role"
                                onChange={handleSelectChange}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="manager">Manager</MenuItem>
                                <MenuItem value="cashier">Cashier</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField name="phone" label="Phone" value={formState.additional_info.phone} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="pay_rate" label="Pay Rate" value={formState.additional_info.pay_rate} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="alt_email" label="Alternate Email" value={formState.additional_info.alt_email} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="preferred_name" label="Preferred Name" value={formState.additional_info.preferred_name} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="address" label="Address" value={formState.additional_info.address} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="emergency_contact_first_name" label="Emergency Contact First Name" value={formState.additional_info.emergency_contact_first_name} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="emergency_contact_last_name" label="Emergency Contact Last Name" value={formState.additional_info.emergency_contact_last_name} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="emergency_contact_phone" label="Emergency Contact Phone" value={formState.additional_info.emergency_contact_phone} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
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

export default AddEmployeeModal;