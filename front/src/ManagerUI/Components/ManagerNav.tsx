import React, { useState } from 'react';
import '../Styles/ManagerNav.css';
import MenuIcon from '@mui/icons-material/Menu';
import { List, ListItem, Button, IconButton } from '@mui/material';
import { useAuth } from '../../SharedComponents/AuthContext';
import { useModal } from '../../SharedComponents/ModalContext';
import { useNavigate } from 'react-router-dom';

interface ManagerNavProps {
    setActiveSection: (section: string) => void;
    isDrawerOpen: boolean;
    setIsDrawerOpen: (isOpen: boolean) => void;
}

/**
 * `ManagerNav` is a React component that displays a navigation drawer for managers.
 * 
 * @remarks
 * This component displays a list of navigation items that the manager can click to navigate to different sections of the application.
 * The navigation drawer can be opened and closed.
 * The manager can also switch user or sign out.
 * 
 * @param setActiveSection - Function to set the active section
 * @param isDrawerOpen - Boolean indicating whether the drawer is open
 * @param setIsDrawerOpen - Function to open or close the drawer
 * 
 * @returns The rendered `ManagerNav` component
 */

const ManagerNav: React.FC<ManagerNavProps> = ({ isDrawerOpen, setIsDrawerOpen, setActiveSection }) => {
    const [openSection, setOpenSection] = useState<string>('');
    const { user, setUser } = useAuth();

    const {  setErrorMessage, setShowErrorModal } = useModal();

    const toggleSection = (section: string) => {
        if (openSection !== section) {
            setOpenSection(section);
            setActiveSection(section);
        }
    };

    if (!user) {
        setErrorMessage('You are not signed in');
        setShowErrorModal(true);
    }

    const navItems = ['Menu', 'Families', 'Inventory', 'Orders', 'Analytics', 'Employees', 'Customers'];

    return (
        <div className={`lhs ${isDrawerOpen ? '' : 'lhs-closed'}`} style={{ borderRight: isDrawerOpen ? '1px solid rgba(0, 0, 0, 0.1)' : '' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px' }}>
                <IconButton
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    className="menu-icon"
                    style={{ fontSize: '2rem' }}
                    size="large"
                >
                    <MenuIcon />
                </IconButton>
            </div>

            {isDrawerOpen && (
                <List>
                    {navItems.map((item) => (
                        <ListItem key={item} onClick={() => toggleSection(item)}>
                            <Button variant="text" fullWidth>
                                {item}
                            </Button>
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
};

export default ManagerNav;
