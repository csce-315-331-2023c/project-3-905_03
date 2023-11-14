import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user } = useAuth();

    const isAuthorized = user && user.isAuthenticated && allowedRoles.includes(user.role || '');

    if (!isAuthorized) {
        return <Navigate to="/customer-kiosk" replace />;
    }

    const handleClose = () => {
        setShowErrorModal(false);
        navigate('/');
    };

    return (
        <>
            {showErrorModal && (
                <ErrorModal
                    isOpen={showErrorModal}
                    errorMessage="Please sign in to access this page."
                    onClose={handleClose}
                />
            )}
            {isAuthorized && <Outlet />}
        </>
    );
};


export default ProtectedRoute;

/**
 * 
 * Notes: Components and Functionality Scope
 */