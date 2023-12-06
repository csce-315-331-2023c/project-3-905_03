import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField } from '@mui/material';

interface ConfirmationModalProps {
    closeModal: () => void;
    submitFunction: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ closeModal, submitFunction}) => {
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
                        <h2><b>This action cannot be undone</b></h2>
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