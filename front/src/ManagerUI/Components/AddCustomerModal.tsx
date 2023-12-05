import { Box, TextField } from '@mui/material';
import React, { useState, ChangeEvent, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';

interface Row {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
}

interface AddCustomerModalProps {
    closeModal: () => void;
    onSubmit: (newRow: Row) => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ closeModal, onSubmit }) => {
    const [formState, setFormState] = useState<Row>(
        { 
            user_id: 0,
            first_name: '',
            last_name: '',
            email: '',
            created_at: '',
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

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        onSubmit(formState);
        closeModal();

    };

    const handleConfirmation = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setShowConfirmationModal(true);
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
                        </div>
                        <div style={{ display: 'inline-flex', gap: '20px'}}>
                            <button className='btn' onClick={handleConfirmation}>Submit</button>
                            <button className='btn' onClick={() => closeModal()}>Cancel</button>
                        </div>
                </Box>
            </div>
            {showConfirmationModal && <ConfirmationModal closeModal={() => setShowConfirmationModal(false)} submitFunction={handleSubmit}/>}
        </div>
    )
}

export default AddCustomerModal;