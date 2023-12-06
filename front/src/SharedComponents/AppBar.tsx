import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, Avatar, Tooltip, Menu, MenuItem, Typography, IconButton } from '@mui/material';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import TranslateIcon from '@mui/icons-material/Translate';
import { useAuth } from './AuthContext';
import MessLogo from './MessLogo.tsx';
import UserModal from './User';

function ResponsiveAppBar() {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialSection, setInitialSection] = useState('Account');
    const { user, setUser } = useAuth();
    const navigate = useNavigate();


    const handleOpenUserMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    }, []);

    const handleCloseUserMenu = useCallback(() => {
        setAnchorElUser(null);
    }, []);

    const handleUserAction = useCallback((action: string) => {
        if (action === 'Switch Mode' && user?.role === 'admin') {
            navigate('/cashier');
        } else if (action === 'Logout') {
            setUser(null);
            navigate('/');
            localStorage.clear();
        }
        handleCloseUserMenu();
    }, [user, setUser, navigate, handleCloseUserMenu]);

    const handleOpenModal = useCallback((section: string) => {
        setInitialSection(section);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const settings = [
        { name: 'Account', action: () => handleOpenModal('Account') },
        { name: 'Switch Mode', action: () => handleUserAction('Switch Mode') },
        { name: 'Logout', action: () => handleUserAction('Logout') },
    ];

    return (
        <>
            <AppBar position="fixed" elevation={0} sx={{
                alignItems:'center', height: '7.5vh', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1a1a1a', borderBottom: '1px solid rgba(0, 0, 0, 0.12)', padding: '0px'
            }}>
                <Toolbar sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0px' }}>
                    <MessLogo style={{ width: '125px', height: '65px' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: '35px' }}>
                        <IconButton size='large' onClick={() => handleOpenModal('Language')}>
                            <TranslateIcon sx={{ color: '#ffffff', mr: '5px' }} />
                        </IconButton>
                        <IconButton size='large' onClick={() => handleOpenModal('Accessibility')}>
                            <AccessibilityIcon sx={{ color: '#ffffff', mr: '5px' }} />
                        </IconButton>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={`${user?.firstName} ${user?.lastName}`} src={user?.profilePic || "/static/images/avatar/2.jpg"} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting.name} onClick={setting.action}>
                                    <Typography textAlign="center">{setting.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <UserModal
                isOpen={isModalOpen}
                initialSection={initialSection}
                onClose={handleCloseModal}
            />
        </>
    );
}

export default ResponsiveAppBar;

