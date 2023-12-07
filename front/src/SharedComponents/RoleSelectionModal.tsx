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

    const handleRoleSelect = (role: string) => {

        setTimeout(() => setShowRoleSelectionModal(false), 3);
        if (role === user?.role) {
            return;
        }
        if (role === 'cashier') {
            localStorage.setItem('mode', 'cashier');
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
                    {['Cashier', 'Manager', 'Kitchen', 'TV1', 'TV2'].map(role => (
                        <Button
                            key={role}
                            variant="contained"
                            onClick={() => handleRoleSelect(role)}
                            sx={{
                                backgroundColor: '#1a1a1a', color: 'white', margin: '5px', width: '100px', borderRadius:'0px', '&:hover': {
                                    backgroundColor: '#2c5dba' }
                            }} 
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
