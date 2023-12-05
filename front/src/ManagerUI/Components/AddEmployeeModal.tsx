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
    return (
        <div></div>
    )
}

export default AddEmployeeModal;