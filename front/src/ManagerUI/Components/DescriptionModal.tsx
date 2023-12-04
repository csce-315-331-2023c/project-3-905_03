import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';

interface DescriptionModalProps {
    closeModal: () => void;
    family_description: string;
    family_id: number;
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({ closeModal, family_description, family_id }) => {
    const [description, setDescription] = useState<string>(family_description);
    const [editMode, setEditMode] = useState<boolean>(false);

    const handleEdit = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setDescription(value);
    }

    const handleSave = () => { 
        axios.post('/editFamilyDescription', { family_id, family_description: description })
            .then(() => {
                closeModal();
            })
            .catch(err => console.log(err));
    }
    

    return (
        <div className='modal-container'>
            <div className='modal'>
                <div className='form-group'>
                    <label htmlFor="family_description" className='form-label'>Family Description</label>
                    <textarea name="family_description" value={description} disabled={!editMode} onChange={handleEdit}/>
                </div>
                {editMode === false ? (
                        <div className="button-container">
                            <button className="login-button" onClick={() => {setEditMode(true)}}>Edit</button>
                            <button className="login-button" onClick={() => closeModal()}>Close</button>
                        </div>
                ) : (
                    <div className="button-container">
                        <button className="login-button" onClick={() => {handleSave()}}>Save</button>
                        <button className="login-button" onClick={() => closeModal()}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    )

}

export default DescriptionModal;