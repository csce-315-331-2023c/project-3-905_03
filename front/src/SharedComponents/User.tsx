import React from 'react';
import { useAuth } from './AuthContext';

const User: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="user-container">No user data available</div>;
    }

    return (
        <div className="user-container">
            <h1>User Profile</h1>
            <p><strong>User:</strong> {JSON.stringify(user)} </p>
        </div>
    );
};

export default User;
