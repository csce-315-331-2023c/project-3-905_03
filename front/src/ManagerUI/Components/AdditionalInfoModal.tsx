import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
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

interface AdditionalInfoModalProps {
    closeModal: () => void;
    additional_info: AdditionalInfo;
    employee_id: number;
}

/**
 * `AdditionalInfoModal` is a React component that displays a modal for editing additional information of an employee.
 * 
 * @remarks
 * This component displays a form for the user to edit the employee's additional information, including phone, pay rate, alternate email, preferred name, address, and emergency contact details.
 * The form starts in view mode and can be switched to edit mode.
 * When the form is submitted, the edited information is sent to the server and the modal is closed.
 * 
 * @param closeModal - Function to close the modal
 * @param additional_info - The current additional information of the employee
 * @param employee_id - The ID of the employee
 * 
 * @returns The rendered `AdditionalInfoModal` component
 */
const AdditionalInfoModal: React.FC<AdditionalInfoModalProps> = ({ closeModal, additional_info, employee_id }) => {
    const [formState, setFormState] = useState<AdditionalInfo>(
        { phone: additional_info.phone, 
            pay_rate: additional_info.pay_rate, 
            alt_email: additional_info.alt_email, 
            preferred_name: additional_info.preferred_name, 
            address: additional_info.address, 
            emergency_contact_first_name: additional_info.emergency_contact_first_name, 
            emergency_contact_last_name: additional_info.emergency_contact_last_name, 
            emergency_contact_phone: additional_info.emergency_contact_phone }
    )
    const [editMode, setEditMode] = useState<boolean>(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

    const handleEditMode = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setEditMode(true);
    }

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    }

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => { 
        e.preventDefault();
        axios.post('/editEmployeeAdditionalInfo', { employee_id, additional_info: formState })
            .then(() => {
                closeModal();
            })
            .catch(err => console.log(err));
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
                        <TextField name="phone" label="Phone Number" disabled={!editMode} value={formState.phone} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="pay_rate" label="Pay Rate" disabled={!editMode} value={formState.pay_rate} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="alt_email" label="Alternate Email" disabled={!editMode} value={formState.alt_email} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="preferred_name" label="Preferred Name" disabled={!editMode} value={formState.preferred_name} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="address" label="Address" disabled={!editMode} value={formState.address} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="emergency_contact_first_name" label="Emergency Contact First Name" disabled={!editMode} value={formState.emergency_contact_first_name} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="emergency_contact_last_name" label="Emergency Contact Last Name" disabled={!editMode} value={formState.emergency_contact_last_name} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                        <TextField name="emergency_contact_phone" label="Emergency Contact Phone" disabled={!editMode} value={formState.emergency_contact_phone} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
                    </div>
                    <div>
                        {editMode === false ? (
                            <div style={{ display: 'inline-flex', gap: '20px'}}>
                                <button className="btn" onClick={handleEditMode}>Edit</button>
                                <button className="btn" onClick={() => closeModal()}>Close</button>
                            </div>
                        ) : (
                            <div style={{ display: 'inline-flex', gap: '20px'}}>
                                <button className="btn" onClick={handleConfirmation}>Save</button>
                                <button className="btn" onClick={() => closeModal()}>Cancel</button>
                            </div>
                        )}
                    </div>
                </Box>
            </div>
            {showConfirmationModal && <ConfirmationModal closeModal={() => setShowConfirmationModal(false)} submitFunction={handleSave} />}
        </div>
    )

}

export default AdditionalInfoModal;