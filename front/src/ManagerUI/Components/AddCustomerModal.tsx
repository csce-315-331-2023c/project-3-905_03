import React, { useState, ChangeEvent, useEffect } from 'react';

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


    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    return (
         <div className='modal-container' style={{overflowY: 'scroll'}}
            onClick={(e) => {
                const target = e.target as HTMLTextAreaElement;
                if (target.className === "modal-container") closeModal();
            }}>
            <div className='modal'>
                <form action="">
                    <div className='form-group'>
                        <label htmlFor="first_name" className='form-label'>First Name</label>
                        <input name="first_name" type="text" value={formState.first_name} onChange={handleFormChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="last_name" className='form-label'>Last Name</label>
                        <input name="last_name" type="text" value={formState.last_name} onChange={handleFormChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="email" className='form-label'>Email</label>
                        <input name="email" type="text" value={formState.email} onChange={handleFormChange} />
                    </div>
                    <button className='btn' onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default AddCustomerModal;