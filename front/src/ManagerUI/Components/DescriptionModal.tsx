import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField } from '@mui/material';
import ConfirmationModal from './ConfirmationModal';

interface DescriptionModalProps {
    closeModal: () => void;
    family_description: string;
    family_id: number;
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({ closeModal, family_description, family_id }) => {
    const [description, setDescription] = useState<string>(family_description);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setDescription(value);
    }

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => { 
        e.preventDefault();
        axios.post('/editFamilyDescription', { family_id, family_description: description })
            .then(() => {
                closeModal();
            })
            .catch(err => console.log(err));
    }

    const handleEditMode = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setEditMode(true);
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
                        '& .MuiTextField-root': { m: 1, width: '50ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    >
                    <div>
                        <TextField name="family_description" disabled={!editMode} label="Family Description" multiline value={description} onChange={handleFormChange} variant='outlined' style={{ outline: 'none' }}/>
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
            {showConfirmationModal && <ConfirmationModal closeModal={() => setShowConfirmationModal(false)} submitFunction={handleSave}/>}
        </div>
    )

}

export default DescriptionModal;