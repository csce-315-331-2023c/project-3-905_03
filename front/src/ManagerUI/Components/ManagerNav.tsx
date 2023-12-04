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
}

const ManagerNav: React.FC<ManagerNavProps> = ({ setActiveSection }) => {
    const [openSection, setOpenSection] = useState<string>('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(true); 
    const { user, setUser } = useAuth();
    const { errorMessage, setErrorMessage, showErrorModal, setShowErrorModal } = useModal();

    const navigate = useNavigate();

    const toggleSection = (section: string) => {
        const newSection = openSection === section ? '' : section;
        setOpenSection(newSection);
        setActiveSection(newSection);
    };

    const handleSwitchUser = () => {
        console.log(user);
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

    const navItems = ['User', 'Menu', 'Inventory', 'Orders', 'Analytics'];

    return (
        <div className="manager-nav-container">
            <IconButton
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="menu-icon"
            >
                <MenuIcon />
            </IconButton>


            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                PaperProps={{ style: { width: '15%' } }}

            >
                <MessLogo className='mess-logo' />
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
                <Button className="sign-out-button" onClick = {handleSignOut}>Sign Out</Button>
            </Drawer>
            
        </div>
    );

};

export default ManagerNav;
