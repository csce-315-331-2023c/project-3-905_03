import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/Modal.css';

interface ErrorModalProps {
    isOpen: boolean;
    errorMessage: string;
    onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, errorMessage, onClose }) => {
    if (!isOpen) return null;


    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div className="error-modal-backdrop">
            <div className="error-modal">
                <h2>An Error Occurred</h2>
                <p>{errorMessage}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>,
        modalRoot
    );
};

export default ErrorModal;