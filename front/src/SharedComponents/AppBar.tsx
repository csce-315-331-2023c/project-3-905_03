import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, Avatar, Tooltip, Menu, MenuItem, Typography, IconButton } from '@mui/material';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import TranslateIcon from '@mui/icons-material/Translate';
import FormatColorResetIcon from '@mui/icons-material/FormatColorReset';
import { useAuth } from './AuthContext';
import MessLogo from './MessLogo.tsx';
import { useModal } from './ModalContext';
import UserModal from './User';
import RoleSelectionModal from './RoleSelectionModal.tsx';
import TranslateModal from './TranslateModal';

function ResponsiveAppBar() {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
    const [initialSection, setInitialSection] = useState('Account');
    const [zoomFactor, setZoomFactor] = useState(1);
    const [isGrayscale, setIsGrayscale] = useState(false);
    const { showErrorModal, setShowErrorModal, showRoleSelectionModal, setShowRoleSelectionModal, errorMessage, setErrorMessage } = useModal();

    const { user, setUser } = useAuth();
    
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.filter = isGrayscale ? 'grayscale(100%) contrast(1.25)' : 'none';
    }, [isGrayscale]);

    const handleOpenUserMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    }, []);

    const handleCloseUserMenu = useCallback(() => {
        setAnchorElUser(null);
    }, []);

    const handleUserAction = useCallback((action: string) => {
        if (action === 'Switch Mode') {
            setShowRoleSelectionModal(true);
        } 
            
         else if (action === 'Logout') {
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

    

    const handleZoomIn = () => {
        const newZoomFactor = zoomFactor + 0.1;
        setZoomFactor(newZoomFactor);
        (document.body.style as any).zoom = `${newZoomFactor}`;
    };

    const handleZoomOut = () => {
        const newZoomFactor = zoomFactor > 1 ? zoomFactor - 0.1 : 1;
        setZoomFactor(newZoomFactor);
        (document.body.style as any).zoom = `${newZoomFactor}`;
    };


    const handleColorReset = () => {
        setIsGrayscale(!isGrayscale);
    };

    const handleTranslateModal = () => {
        setIsTranslateModalOpen(!isTranslateModalOpen);
    }

    const handleRoleSelectionModal = () => {
        setShowRoleSelectionModal(!showRoleSelectionModal);
    }


    let settings = [];

    if (!user && window.location.pathname !== '/') {
        settings.push({ name: 'Login', action: () => navigate('/') });
    }

    if (user) {
        settings.push({ name: 'Account', action: () => handleOpenModal('Account') });
    }

    if (user && user?.role !== 'customer') {
        settings.push({ name: 'Switch Mode', action: () => handleUserAction('Switch Mode') });
    }

    if (user) {
        settings.push({ name: 'Logout', action: () => handleUserAction('Logout') });
    }



    return (
        <>
            <AppBar position="fixed" elevation={0} sx={{
                alignItems: 'center', minHeight: '80px',height: '7.5vh', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1a1a1a', borderBottom: '1px solid rgba(0, 0, 0, 0.12)', padding: '0px'
            }}>
                <Toolbar sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0px' }}>
                    <MessLogo style={{ width: '10%', height: '80%' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: '35px' }}>
                        <IconButton size='large' sx={{ color: '#ffffff', mr: '5px' }} >
                            <TranslateIcon sx={{ color: '#ffffff', mr: '5px' }} onClick={() => handleTranslateModal() } />
                        </IconButton>
                        <IconButton size='large'>
                            <ZoomOutIcon sx={{ color: '#ffffff', mr: '5px' }} onClick={() => handleZoomOut()} />
                        </IconButton>
                        <IconButton size='large'>
                            <ZoomInIcon sx={{ color: '#ffffff', mr: '5px' }} onClick={() => handleZoomIn()} />
                        </IconButton>
                        <IconButton size='large'>
                            <FormatColorResetIcon sx={{ color: '#ffffff', mr: '5px' }} onClick={() => handleColorReset()} />
                        </IconButton>
                        <Tooltip title="Settings">
                            <IconButton sx={{ p: 0 }} >
                                {user?.profilePic ? (
                                    <Avatar alt={`${user.firstName} ${user.lastName}`} src={user.profilePic} sx={{ color: '#ffffff' }} onClick={handleOpenUserMenu} />
                                ) : (
                                        
                                        <IconButton size='large' onClick={handleOpenUserMenu}>
                                            <NoAccountsIcon sx={{ color: '#ffffff' }} />
                                        </IconButton>
                                )} 
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
                            sx={{
                                marginTop: '5vh', 
                            }}
                        >
                            {
                                settings.map((setting) => (
                                    <MenuItem key={setting.name} onClick={setting.action}>
                                        <Typography textAlign="center">{setting.name}</Typography>
                                    </MenuItem>
                                ))
                            }
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <RoleSelectionModal
                isOpen={showRoleSelectionModal}
                onClose={handleRoleSelectionModal}
            />
            <UserModal
                isOpen={isModalOpen}
                initialSection={initialSection}
                onClose={handleCloseModal}
            />
            <TranslateModal
                isOpen={isTranslateModalOpen}
                onClose={handleTranslateModal}
            />
        </>
    );
}

export default ResponsiveAppBar;

