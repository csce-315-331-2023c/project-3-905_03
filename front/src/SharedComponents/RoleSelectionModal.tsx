import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import CloseButton from '@mui/icons-material/CloseTwoTone';
import './Styles/RoleSelectionModal.css';
import { useModal } from './ModalContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


interface RoleSelectionModalProps {
    isOpen: boolean;
    onClose: (role?: string) => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onClose }) => {
    const { showRoleSelectionModal, setShowRoleSelectionModal } = useModal();
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    if (!showRoleSelectionModal) {
        return null;
    }

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        return null;
    }

    const getRolesForUser = () => {
        switch (user?.role) {
            case 'admin':
                return ['Cashier', 'Manager', 'Kitchen', 'TV1', 'TV2'];
            case 'manager':
                return ['Manager','TV1', 'TV2'];
            case 'cashier':
                return ['Cashier', 'Kitchen'];
            default:
                return [];
        }
    };


    const handleRoleSelect = (role: string) => {
        setTimeout(() => setShowRoleSelectionModal(false), 3);
        if (role === user?.role) {
            return;
        }
        navigate(`/${role}`);
    };


    return ReactDOM.createPortal(
        <div className="modal-backdrop">
            <div className="modal">
                <Button
                    id="modalCloseButton"
                    variant="outlined"
                    startIcon={<CloseButton />}
                    onClick={() => onClose()}
                    sx={{ position: 'absolute', top: '10px', left: '10px' }} 
                />
                <h2>Proceed To</h2>
                <div className='role-options'>
                    {getRolesForUser().map(role => (
                        <Button
                            key={role}
                            className="login-button"
                            onClick={() => handleRoleSelect(role)}
                        >
                            {role.charAt(0).toUpperCase() + role.slice(1).replace(/-/g, ' ')}
                        </Button>
                    ))}
                </div>
            </div>
        </div>,
        modalRoot
    );
};

export default RoleSelectionModal;
