import React, { useState } from 'react';
import '../Styles/ManagerNav.css';
import MessLogo from '../../SharedComponents/MessLogo';
import { useAuth } from '../../SharedComponents/AuthContext'; // Make sure this path is correct
import Avatar from '@mui/material/Avatar';

interface ManagerNavProps {
    setActiveSection: (section: string) => void;
}

const ManagerNav: React.FC<ManagerNavProps> = ({ setActiveSection }) => {
    const [openSection, setOpenSection] = useState<string>('');
    const { user } = useAuth(); // Access user details from AuthContext

    const toggleSection = (section: string) => {
        const newSection = openSection === section ? '' : section;
        setOpenSection(newSection);
        setActiveSection(newSection);
    };

    const navItems = ['Menu', 'Inventory', 'Orders', 'Analytics'];

    return (
        <nav className="manager-nav">
            <MessLogo />
            {user && (
                <div className={`nav-item ${openSection === 'User' ? 'active' : ''}`}>
                    <button onClick={() => toggleSection('User')}>
                        {`${"Account"}`}
                    </button>
                </div>
            )}
            {navItems.map((item) => (
                <div className={`nav-item ${openSection === item ? 'active' : ''}`} key={item}>
                    <button onClick={() => toggleSection(item)}>
                        {item}
                    </button>
                </div>
            ))}
        </nav>
    );
};

export default ManagerNav;
