import React from 'react';
import axios from 'axios';
import "./AddMenuModal.css";

interface ViewOrderModalProps {
    closeModal: () => void
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({closeModal}) => {
    return (
        <div className='modal-container' 
        onClick={(e) => {
            const target = e.target as HTMLTextAreaElement
            if (target.className === "modal-container") closeModal();
            }}>
            <div className='modal'>
            </div>
        </div>
    )
}

export default ViewOrderModal