
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from './AuthContext';
import { TextField, Button, Avatar, Typography, Grid, Box, Paper, Divider } from '@mui/material';
import './Styles/User.css';

interface UserProps {
    isOpen: boolean;
    onClose: () => void;
    initialSection: string;
}

const User: React.FC<UserProps> = ({ isOpen, initialSection, onClose }) => {
    // @ts-ignore
    const { user, setUser } = useAuth();
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
    const [feedback, setFeedback] = React.useState({ error: '', success: '' });

    useEffect(() => {
        if (isOpen && initialSection) {
            const sectionElement = document.getElementById(initialSection);
            sectionElement?.scrollIntoView();
        }
    }, [isOpen, initialSection]);

    if (!isOpen || !user) return null;
    
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    const handlePasswordChange = () => {
        setFeedback({ error: '', success: '' });
        if (newPassword !== confirmNewPassword) {
            setFeedback({ success: '', error: 'Passwords do not match' });
            return;
        }
        if (currentPassword === newPassword) {
            setFeedback({ success: '', error: 'New password must be different from current password' });
            return;
        }

    };

    return ReactDOM.createPortal(
        <div className={`modal-backdrop ${isOpen ? 'open' : ''}`} >
            <div className="modal">
                <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, overflowY: 'auto' }}>
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
                        <Divider sx={{ my: 2 }} />
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
                            {feedback.error && <Typography color="error">{feedback.error}</Typography>}
                            {feedback.success && <Typography color="success.main">{feedback.success}</Typography>}
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



                    <Divider sx={{ my: 2 }} />
                    <div id='Language'>
                        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                            <Typography variant="h6" gutterBottom><b>Language</b></Typography>

                        </Paper>
                    </div>


                    <Divider sx={{ my: 2 }} />
                    <div id='Accessibility'>
                        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                            <Typography variant="h6" gutterBottom><b>Accessibility</b></Typography>

                        </Paper>
                    </div>

                </Box>
                <button onClick={onClose}>Close</button>
            </div>
        </div>,
        modalRoot
    );
};

export default User;