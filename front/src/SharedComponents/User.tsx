import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button, TextField, Avatar, Typography, Grid, Box, Paper, Divider, Switch, FormControlLabel, IconButton } from '@mui/material';
import CloseButton from '@mui/icons-material/CloseTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth, User as UserType } from './AuthContext';
import './Styles/User.css';

interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

interface Feedback {
    error: string;
    success: string;
}

interface UserProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserComponent: React.FC<UserProps> = ({ isOpen, onClose }) => {
    const { user, setUser } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState<UserType | null>(user);
    const [passwordData, setPasswordData] = useState<PasswordData>({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [feedback, setFeedback] = useState<Feedback>({ error: '', success: '' });

    useEffect(() => {
        if (user) {
            setUserData(user);
        }
    }, [user]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserData(prevUserData => ({ ...prevUserData as UserType, [event.target.name]: event.target.value }));
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [event.target.name]: event.target.value });
    };

    const handleSaveChanges = () => {
        if (userData) {
            setUser(userData);
        }

        // Upload
    };

    const handlePasswordSubmit = () => {
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setFeedback({ success: '', error: 'Passwords do not match' });
            return;
        }
        if (passwordData.currentPassword === passwordData.newPassword) {
            setFeedback({ success: '', error: 'New password must be different from current password' });
            return;
        }
        // Upload
    };

    if (!isOpen || !userData) return null;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <Box className={`modal-backdrop ${isOpen ? 'open' : ''}`} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <Paper sx={{ p: 3, width: '90%', maxWidth: '600px', maxHeight: '75vh', overflowY: 'auto', position: 'relative' }}>
                <Button startIcon={<CloseButton />} onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <Avatar src={userData.profilePic || ''} sx={{ width: 120, height: 120, marginRight: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Typography>{userData.firstName} {userData.lastName}</Typography>
                                <Typography sx={{ mr: 1 }}>{userData.email}</Typography>
                            </Grid>
                        </Grid>
                        <Typography variant="caption" sx={{ color: 'gray' }}>{userData.role}</Typography>
                    </Box>
                    <IconButton onClick={() => setEditMode(!editMode)} sx={{ marginLeft: 1 }}>
                        {editMode ? <CloseIcon /> : <EditIcon />}
                    </IconButton>
                </Box>
                <Divider sx={{ mt: 2 }} />
                <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField label="First Name" fullWidth disabled={!editMode} name="firstName" value={userData.firstName || ''} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Last Name" fullWidth disabled={!editMode} name="lastName" value={userData.lastName || ''} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Email" fullWidth disabled={!editMode} name="email" value={userData.email || ''} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Alt Email" fullWidth disabled={!editMode} name="altEmail" value={userData.altEmail || ''} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Phone" fullWidth disabled={!editMode} name="phone" value={userData.phone || ''} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Address" fullWidth disabled={!editMode} name="address" value={userData.address || ''} onChange={handleInputChange} />
                        </Grid>
                        {editMode && <Grid item xs={12}><Button variant="contained" onClick={handleSaveChanges} fullWidth sx={{ mt: 2 }}>Save Changes</Button></Grid>}
                    </Grid>
                </Box>
                <Divider sx={{ mt: 2 }} />
                <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField label="Current Password" type="password" fullWidth name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="New Password" type="password" fullWidth name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Confirm New Password" type="password" fullWidth name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} />
                        </Grid>
                        {feedback.error && <Grid item xs={12}><Typography color="error" sx={{ mt: 2 }}>{feedback.error}</Typography></Grid>}
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={handlePasswordSubmit} fullWidth sx={{ mt: 2 }}>Change Password</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>,
        modalRoot
    );
};

export default UserComponent;
