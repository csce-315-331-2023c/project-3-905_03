import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/Modal.css';

/**
 * Props for the AccessibilityModal component.
 */
interface AccessibilityModalProps {
    /** Whether the modal is open. */
    isOpen: boolean;
    /** Function to call when the modal should be closed. */
    onClose: () => void;
}

/**
 * A modal for accessibility options.
 *
 * This component creates a modal that displays a message saying that the feature is not yet implemented.
 * The modal can be closed by clicking a button.
 */
const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div className="error-modal-backdrop">
            <div className="error-modal">
                <h2>Accessibility Options</h2>
                <p>This feature is not yet implemented.</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>,
        modalRoot
    );
};

export default AccessibilityModal;