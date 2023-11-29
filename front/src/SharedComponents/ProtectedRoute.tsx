import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import ErrorModal from './ErrorModal';
import RoleSelectionModal from './RoleSelectionModal'; // Import the RoleSelectionModal

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user, setUser } = useAuth(); 
    const navigate = useNavigate();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showRoleSelectionModal, setShowRoleSelectionModal] = useState(false);

    useEffect(() => {
        if (user && user.isAuthenticated) {
            if (user.role === 'f') {
                setShowRoleSelectionModal(true);
            } 
        }
    }, [user, allowedRoles]);


    if (showErrorModal) {
        return (
            <ErrorModal
                isOpen={showErrorModal}
                errorMessage="You do not have access to this page."
                onClose={() => navigate('/')}
            />
        );
    }

    if (showRoleSelectionModal) {
        return (
            <RoleSelectionModal
                isOpen={showRoleSelectionModal}
                onClose={() => setShowRoleSelectionModal(false)}
                
            />
        );
    }

    return user && allowedRoles.includes(user.role) ? <Outlet /> : null;
};

export default ProtectedRoute;
