import React, { useState } from 'react';
import '../Styles/ManagerNav.css';
import MenuIcon from '@mui/icons-material/Menu';
import { Drawer, List, ListItem, Button, IconButton } from '@mui/material';
import MessLogo from '../../SharedComponents/MessLogo';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../SharedComponents/AuthContext';
import { useModal } from '../../SharedComponents/ModalContext'
import { useNavigate } from 'react-router-dom';

interface ManagerNavProps {
    setActiveSection: (section: string) => void;
    isDrawerOpen: boolean;
    setIsDrawerOpen: (isOpen: boolean) => void;
}

const ManagerNav: React.FC<ManagerNavProps> = ({ setActiveSection, isDrawerOpen, setIsDrawerOpen }) => {
    const [openSection, setOpenSection] = useState<string>('');
    const { user, setUser } = useAuth();
    const { errorMessage, setErrorMessage, showErrorModal, setShowErrorModal } = useModal();

    const navigate = useNavigate();

    const toggleSection = (section: string) => {
        const newSection = openSection === section ? '' : section;
        setOpenSection(newSection);
        setActiveSection(newSection);
    };

    const handleSwitchUser = () => {
        if (user?.role === 'admin') {
            navigate('/cashier');
        }
    }

    const handleSignOut = () => {
        setUser(null);
        navigate('/');
        localStorage.clear();
    }

    if (!user) {
        setErrorMessage('You are not signed in');
        setShowErrorModal(true);
    }
        
        
    const navItems = ['Menu', 'Families', 'Inventory', 'Orders', 'Analytics', 'Employees', 'Customers'];


    return (
        <div className="manager-nav-container">
            <IconButton
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className={`menu-icon ${isDrawerOpen ? '' : 'menu-icon-rotate'}`}
                style={{ fontSize: 'large' }}
            >
                <MenuIcon />
            </IconButton>
            

            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                PaperProps={{ className: "manager-nav-drawer" }}
            >
                <div className='nav-top-section'>
                    <IconButton className="close-icon" onClick={() => setIsDrawerOpen(false)} sx={{fontSize: 'large'} }>
                        <CloseIcon />
                    </IconButton>
                </div>

                
                <div className='nav-middle-section'>
                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item} onClick={() => toggleSection(item)}>
                                <Button variant="text" fullWidth sx={{ backgroundColor: '#ffffff' }}>
                                    {item}
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </div>
                <div className="nav-bottom-section">
                    <Button className="sign-out-button" onClick={handleSwitchUser}>Switch User</Button>
                    <Button className="sign-out-button" onClick={handleSignOut}>Sign Out</Button>
                </div>
            </Drawer>


        </div>
    );

};

export default ManagerNav;