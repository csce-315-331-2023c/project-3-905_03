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

    return <Outlet />;
};


export default ProtectedRoute;
