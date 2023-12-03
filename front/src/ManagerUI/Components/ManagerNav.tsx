import React, { useState } from 'react';
import '../Styles/ManagerNav.css';
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface ManagerNavProps {
    setActiveSection: (section: string) => void;
}

const ManagerNav: React.FC<ManagerNavProps> = ({ setActiveSection }) => {
    const [openSection, setOpenSection] = useState<string>('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleSection = (section: string) => {
        const newSection = openSection === section ? '' : section;
        setOpenSection(newSection);
        setActiveSection(newSection);
        setIsDrawerOpen(false);
    };

    const navItems = ['User', 'Menu', 'Inventory', 'Orders', 'Analytics'];

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
