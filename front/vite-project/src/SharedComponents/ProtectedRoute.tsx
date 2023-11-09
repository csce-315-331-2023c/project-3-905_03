import React, { useState, useEffect } from 'react';
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

    const isAuthorized = user && user.isAuthenticated && allowedRoles.includes(user.role || '');

    useEffect(() => {
        // If the user is not authorized, show the error modal.
        if (!isAuthorized) {
            setShowErrorModal(true);
        }
    }, [isAuthorized]);

    const handleClose = () => {
        setShowErrorModal(false);
        // After closing the modal, redirect to the login route
        navigate('/');
    };

    return (
        <>
            {showErrorModal && (
                <ErrorModal
                    isOpen={showErrorModal}
                    errorMessage="You must sign in to access this page."
                    onClose={handleClose}
                />
            )}
            {isAuthorized && <Outlet />}
        </>
    );
};

export default ProtectedRoute;
