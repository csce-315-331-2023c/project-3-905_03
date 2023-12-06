import React, { useState, ChangeEvent } from 'react';
import "../Styles/Table.css";

interface SearchDatesModalProps {
    closeModal: () => void;
    onSubmit: (startDate: string, endDate: string) => void;
}

/**
 * `SearchDatesModal` is a React component that displays a modal for the user to select a start date and an end date.
 * 
 * @remarks
 * This component takes two functions as props: one to close the modal and one to submit the selected dates.
 * The user can select a start date and an end date using date input fields.
 * When the user clicks the submit button, the selected dates are passed to the submit function and the modal is closed.
 * If the user clicks outside the modal, the modal is closed without submitting the dates.
 * 
 * @param closeModal - Function to close the modal
 * @param onSubmit - Function to submit the selected dates
 * 
 * @returns The rendered `SearchDatesModal` component
 */
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
