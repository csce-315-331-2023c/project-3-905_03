import React from 'react';
import { Box } from '@mui/material';

interface ConfirmationModalProps {
    closeModal: () => void;
    submitFunction: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    delete?: boolean;
}

/**
 * `ConfirmationModal` is a React component that displays a confirmation modal.
 * 
 * @remarks
 * This component displays a modal with a warning message and two buttons: Yes and No.
 * The user can confirm the action by clicking Yes or cancel the action by clicking No.
 * 
 * @param closeModal - Function to close the modal
 * @param submitFunction - Function to execute when the user confirms the action
 * 
 * @returns The rendered `ConfirmationModal` component
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ closeModal, submitFunction, delete: boolean}) => {
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
                        <h2>Are you sure you want to proceed with this action?</h2>
                        {boolean && <p>This action cannot be undone.</p>}
                    </div>
                    <div style={{ display: 'inline-flex', gap: '20px'}}>
                        <button className="btn" onClick={submitFunction}>Yes</button>
                        <button className="btn" onClick={closeModal}>No</button>
                    </div>
                </Box>
            </div>
        </div>
    )
}

export default ConfirmationModal;