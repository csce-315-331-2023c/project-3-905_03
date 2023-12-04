import React, { useState } from 'react';
import '../Styles/ManagerNav.css';
import MessLogo from '../../SharedComponents/MessLogo';
import { useAuth } from '../../SharedComponents/AuthContext'; // Make sure this path is correct
import Avatar from '@mui/material/Avatar';
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface ManagerNavProps {
    setActiveSection: (section: string) => void;
}

const ManagerNav: React.FC<ManagerNavProps> = ({ setActiveSection }) => {
    const [openSection, setOpenSection] = useState<string>('');
    const { user } = useAuth(); // Access user details from AuthContext
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleSection = (section: string) => {
        const newSection = openSection === section ? '' : section;
        setOpenSection(newSection);
        setActiveSection(newSection);
        setIsDrawerOpen(false);
    };

    const navItems = ['Menu', 'Inventory', 'Orders', 'Analytics'];

    return (
        <div>
            <IconButton onClick={() => setIsDrawerOpen(true)}>
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                PaperProps={{ style: { width: '10%' } }}
            >
                <List>
                    {navItems.map((item) => (
                        <ListItem button key={item} onClick={() => toggleSection(item)}>
                            <ListItemText primary={item} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </div>
    );
};

export default ManagerNav;
