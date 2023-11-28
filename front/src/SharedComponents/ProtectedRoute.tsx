import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import ErrorModal from './ErrorModal';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        const isAuthorized = user && user.isAuthenticated && allowedRoles.includes(user.role);

        if (!isAuthorized) {
            setShowErrorModal(true);
        }
    }, [user, allowedRoles]);

    if (showErrorModal) {
        return (
            <ErrorModal
                isOpen={showErrorModal}
                errorMessage="You do not have access to this page."
                onClose={() => navigate('/login')}
            />
        );
    }

    return user && allowedRoles.includes(user.role) ? <Outlet /> : null;
};

export default ProtectedRoute;
