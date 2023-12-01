import React, { useContext, useState } from 'react';
import { useAuth, User } from './AuthContext';
import { TextField, Button, Avatar, Typography, Box } from '@mui/material';

const User: React.FC = () => {
    const { user, setUser } = useAuth();
    const [editMode, setEditMode] = useState(false);

    const [editableUser, setEditableUser] = useState<User>(user!);

    if (!user) {
        return <Box className="user-container"><Typography>No user data available</Typography></Box>;
    }

    const handleEdit = () => {
        setEditMode(true);
        setEditableUser(user); 
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableUser((prevUser) => ({
            ...prevUser!,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = () => {
        setEditMode(false);
        setUser(editableUser!);
    };

    return (
        <Box className="user-container">
            <Typography variant="h4">Signed-In as {user.role.toUpperCase()}</Typography>
            <Avatar src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} />
            {editMode ? (
                <>
                    <TextField
                        label="First Name"
                        value={editableUser?.firstName || ''}
                        onChange={handleChange}
                        name="firstName"
                    />
                    <TextField
                        label="Last Name"
                        value={editableUser?.lastName || ''}
                        onChange={handleChange}
                        name="lastName"
                />
                    <TextField
                        label="Email"
                        value={editableUser?.email || ''}
                        onChange={handleChange}
                        name="email"
                    />
                    <Button onClick={handleSave}>Save</Button>
                </>
            ) : (
                <>
                    <Typography><strong>Email:</strong> {user.email}</Typography>
                    <Typography><strong>First Name:</strong> {user.firstName}</Typography>
                    <Typography><strong>Last Name:</strong> {user.lastName}</Typography>
                    <Button onClick={handleEdit}>Edit</Button>
                </>
            )}
        </Box>
    );
};

export default User;
