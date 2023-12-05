import React, { useState } from 'react';
import '../Styles/ManagerNav.css';
import MenuIcon from '@mui/icons-material/Menu';
import { Drawer, List, ListItem, Button, IconButton } from '@mui/material';
import MessLogo from '../../SharedComponents/MessLogo';
import { useAuth } from '../../SharedComponents/AuthContext';
import {useModal} from '../../SharedComponents/ModalContext'
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
                className="menu-icon"
                style={{ fontSize: '2rem' }} // Increase the icon size
                size = 'large'
            >
                <MenuIcon />
            </IconButton>

            <Drawer
                
                anchor="left"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                PaperProps={{ style: { width: isDrawerOpen ? '15%' : '5%' } }} // Adjust width
            >
                <IconButton
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    className="menu-icon"
                    style={{ fontSize: '2rem' }} // Increase the icon size
                    size='large'
                >
                    <MenuIcon />
                </IconButton>
                <List>
                    {navItems.map((item) => (
                        <ListItem key={item} onClick={() => toggleSection(item)}>
                            <Button variant="text" fullWidth sx={{ color: 'var(--mess-color)' }}>
                                {item}
                            </Button>
                        </ListItem>
                    ))}
                </List>
                <Button className="sign-out-button" onClick={handleSwitchUser}>Switch User</Button>
                <Button className="sign-out-button" onClick={handleSignOut}>Sign Out</Button>
            </Drawer>

        </div>
    );

};

export default ManagerNav;
