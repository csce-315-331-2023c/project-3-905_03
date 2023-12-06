import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { TextField, Button, Avatar, Typography, Grid, Box, Paper } from '@mui/material';


const User: React.FC = () => {
    // @ts-ignore
    const { user, setUser } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [feedback, setFeedback] = useState({ error: '', success: '' });
    
    if (!user) {
        return <Box className="user-container"><Typography>No user data available</Typography></Box>;
    }

    const handlePasswordChange = () => {
        if (newPassword !== confirmNewPassword) {
            setFeedback({ ...feedback, error: 'Passwords do not match' });
            return;
        }
        if (currentPassword === newPassword) {
            setFeedback({ ...feedback, error: 'New password must be different from current password' });
            return;
        }
    };

    return (
        <Box className="user-container" sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom><b>Account</b></Typography>
                <Grid container spacing={3} alignItems="center">
                    <Grid item>
                        <Avatar src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} sx={{ width: 60, height: 60 }} />
                    </Grid>
                    <Grid item xs>
                        <Typography variant="subtitle1">{user.firstName} {user.lastName}</Typography>
                        <Typography variant="body2" color="textSecondary">{user.email}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>{user.role}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom><b>Change Password</b></Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Current Password"
                            type="password"
                            fullWidth
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="New Password"
                            type="password"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePasswordChange}
                            fullWidth
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default User;
