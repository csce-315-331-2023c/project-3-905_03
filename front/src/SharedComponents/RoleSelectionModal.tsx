import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import CloseButton from '@mui/icons-material/CloseTwoTone';
import './Styles/RoleSelectionModal.css';
import { useModal } from './ModalContext'
import { useNavigate } from 'react-router-dom';

/**
 * Interface for the RoleSelectionModal component props.
 */
interface RoleSelectionModalProps {
    isOpen: boolean;
    onClose: (role?: string) => void;
}

/**
 * A modal for selecting a role.
 *
 * This component creates a modal that allows the user to select a role.
 * The modal can be closed by clicking a button.
 */
// @ts-ignore
const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onClose }) => {
    const {  showRoleSelectionModal, setShowRoleSelectionModal} = useModal();
    const navigate = useNavigate();
    if (!showRoleSelectionModal) {
        return null;
    }

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        return null;
    }

    /**
     * Handles the selection of a role.
     * @param role - The role that was selected.
     */
    const handleRoleSelect = (role: string) => {
        setTimeout(() => setShowRoleSelectionModal(false), 3); 
        navigate(`/${role}`)
    };


    return ReactDOM.createPortal(
        <div className="modal-backdrop">
            <div className="modal">
                <Button
                    id="modalCloseButton"
                    variant="outlined"
                    startIcon={<CloseButton />}
                    onClick={() => onClose()}
                    className="close-modal-button"
                />
                <h2>Proceed To ... </h2>
                <div className='role-options'>
                    <button className='role-button' onClick={() => handleRoleSelect('cashier')}>Cashier</button>
                    <button className='role-button' onClick={() => handleRoleSelect('manager')}>Manager</button>
                    <button className='role-button' onClick={() => handleRoleSelect('kitchen-display')}>Kitchen</button>
                    <button className='role-button' onClick={() => handleRoleSelect('dynamic-tv-menu1')}>TV 1</button>
                    <button className='role-button' onClick={() => handleRoleSelect('dynamic-tv-menu2')}>TV 2</button>
                </div>
            </div>
        </div>,
        modalRoot
    );
};

export default RoleSelectionModal;
