import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/ErrorModal.css';

interface AccessibilityModalProps {
    isOpen: boolean;
    onClose: () => void;
}

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