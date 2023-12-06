import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/Modal.css';

/**
 * Props for the ErrorModal component.
 */
interface ErrorModalProps {
    /** Whether the modal is open. */
    isOpen: boolean;
    /** The error message to display. */
    errorMessage: string;
    /** Function to call when the modal should be closed. */
    onClose: () => void;
}

/**
 * A modal for displaying error messages.
 *
 * This component creates a modal that displays an error message.
 * The modal can be closed by clicking a button.
 */
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