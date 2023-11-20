import React from 'react';

// Define the expected props for the User component
interface UserProps {
    userInfo: {
        name: string;
        email: string;
        userId: string;
    };
}

// User component definition
const User: React.FC<UserProps> = ({ userInfo }) => {
    // Here, you would use the userInfo prop to render user details.
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
