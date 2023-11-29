import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/Modal.css';
import { useNavigate } from 'react-router-dom';

interface RoleSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    var navigate = useNavigate();

    const navigateToCashier = () => {
        navigate("/cashier");
        onClose();
    }

    const navigateToManager = () => {  
        navigate("/manager");
        onClose();
    }

    return ReactDOM.createPortal(
        <div className="error-modal-backdrop">
            <div className="error-modal">
                <h2>Proceed As ... </h2>
                <button className='role-button' onClick={navigateToCashier}>Cashier</button>
                <button className='role-button' onClick={navigateToManager}>Manager</button>
            </div>
            <button className='close-modal' onClick={onClose}>Close</button>
        </div>,
        modalRoot
    );
};

export default RoleSelectionModal;