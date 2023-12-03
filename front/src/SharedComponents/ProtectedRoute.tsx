import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useModal } from './ModalContext';
import ErrorModal from './ErrorModal';
import RoleSelectionModal from './RoleSelectionModal';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user } = useAuth();
    const { showErrorModal, setShowErrorModal, showRoleSelectionModal, setShowRoleSelectionModal } = useModal();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('');

    // useEffect(() => {
    //     if (!showRoleSelectionModal && selectedRole) {
    //         navigate(`/${selectedRole}`);
    //         setSelectedRole(''); 
    //     }
    // }, [showRoleSelectionModal, selectedRole, navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else if (user) {
            if (allowedRoles.includes(user.role)) {
                if (user.role === 'admin') {
                    setShowRoleSelectionModal(true);
                } else {
                    navigate(`/${user.role}`);
                }
            } else {
                setShowErrorModal(true);    
            }
        }
    }, [user, allowedRoles, navigate, setShowRoleSelectionModal]);


    const handleRoleSelection = (role?: string) => {
        if (role) {
            setSelectedRole(role); 
        }
        setShowRoleSelectionModal(false);
    };

    if (showErrorModal) {
        return <ErrorModal isOpen={showErrorModal} errorMessage="You do not have access to this page." onClose={() => setShowErrorModal(false)} />;
    }

    if (showRoleSelectionModal) {
        return <RoleSelectionModal isOpen={showRoleSelectionModal} onClose={handleRoleSelection} />;
    }

    return user && allowedRoles.includes(user.role) ? <Outlet /> : null;
};

export default ProtectedRoute;
