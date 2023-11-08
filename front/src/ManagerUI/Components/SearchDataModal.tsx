import React, { useState, ChangeEvent } from 'react';
import "../Styles/Table.css";

interface SearchDatesModalProps {
    closeModal: () => void;
    onSubmit: (startDate: string, endDate: string) => void;
}

const SearchDatesModal: React.FC<SearchDatesModalProps> = ({ closeModal, onSubmit }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        onSubmit(startDate, endDate);
        closeModal();
    }

    return (
        <div className='modal-container'
            onClick={(e) => {
                const target = e.target as HTMLTextAreaElement;
                if (target.className === "modal-container") closeModal();
            }}>
            <div className='modal'>
                <form action="">
                    <div className='form-group'>
                        <label htmlFor="start_date" className='form-label'>Start Date</label>
                        <input type="date" name="start_date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="end_date" className='form-label'>End Date</label>
                        <input type="date" name="end_date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    <button className='btn' onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default SearchDatesModal;
