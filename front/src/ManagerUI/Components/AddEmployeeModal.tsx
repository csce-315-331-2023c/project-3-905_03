import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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


    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleFormChange2 = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            additional_info: {
                ...prevState.additional_info,
                [name]: value
            }
        }));
    };

    const handleFormChange3 = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            additional_info: {
                ...prevState.additional_info,
                [name]: value
            }
        }));
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
                role: val
            })
        }
    }

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
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
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
                    </div>
                    <div className='form-group'>
                        <label htmlFor="phone" className='form-label'>Phone</label>
                        <input name="phone" type="text" value={formState.additional_info.phone} onChange={handleFormChange2} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="pay_rate" className='form-label'>Pay Rate</label>
                        <input name="pay_rate" type="number" value={formState.additional_info.pay_rate} onChange={handleFormChange2} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="alt_email" className='form-label'>Alternate Email</label>
                        <input name="alt_email" type="text" value={formState.additional_info.alt_email} onChange={handleFormChange2} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="preferred_name" className='form-label'>Preferred Name</label>
                        <input name="preferred_name" type="text" value={formState.additional_info.preferred_name} onChange={handleFormChange2} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="address" className='form-label'>Address</label>
                        <textarea name="address" value={formState.additional_info.address} onChange={handleFormChange3} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="emergency_contact_first_name" className='form-label'>Emergency Contact First Name</label>
                        <input name="emergency_contact_first_name" type="text" value={formState.additional_info.emergency_contact_first_name} onChange={handleFormChange2} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="emergency_contact_last_name" className='form-label'>Emergency Contact Last Name</label>
                        <input name="emergency_contact_last_name" type="text" value={formState.additional_info.emergency_contact_last_name} onChange={handleFormChange2} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="emergency_contact_phone" className='form-label'>Emergency Contact Phone</label>
                        <input name="emergency_contact_phone" type="text" value={formState.additional_info.emergency_contact_phone} onChange={handleFormChange2} />
                    </div>
                    <button className='btn' onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default AddEmployeeModal;