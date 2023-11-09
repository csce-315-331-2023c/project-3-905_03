import React from 'react';

interface UserProps {
    userInfo: {
        name: string;
        email: string;
        userId: string;
    };
}

const User: React.FC<UserProps> = ({ userInfo }) => {
    return (
        <div className="user-container">
            <h1>User Profile</h1>
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>User ID:</strong> {userInfo.userId}</p>
        </div>
    );
};

export default User;
