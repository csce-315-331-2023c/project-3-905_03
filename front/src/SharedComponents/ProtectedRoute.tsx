import React, { useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './AuthContext';
import { useModal } from './ModalContext';
import ErrorModal from './ErrorModal';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const { setErrorMessage, setShowErrorModal, showErrorModal } = useModal();

    const handleCloseModal = useCallback(() => {
        setShowErrorModal(false);
        navigate('/');
    }, [navigate, setShowErrorModal]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser: any = jwtDecode(token);
                if (!decodedUser.exp || decodedUser.exp * 1000 < Date.now()) {
                    setErrorMessage('User session expired. Please sign in again.');
                    setShowErrorModal(true);
                    setUser(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                } else if (!allowedRoles.includes(decodedUser.role)) {
                    setErrorMessage('User does not have access to this page.');
                    setShowErrorModal(true);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                navigate('/login');
            }
        } else {
            setErrorMessage('Please sign in to access this page.');
            setShowErrorModal(true);
        }
    }, [user, allowedRoles, navigate, setUser]);

    return (
        <>
            {showErrorModal ? (
                <ErrorModal isOpen={showErrorModal} errorMessage={setErrorMessage.toString()} onClose={handleCloseModal} />
            ) : (
                user && allowedRoles.includes(user.role) ? <Outlet /> : null
            )}
        </>
    );
};

export default ProtectedRoute;
