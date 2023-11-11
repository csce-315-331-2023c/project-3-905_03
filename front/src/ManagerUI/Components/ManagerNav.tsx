import React, { useState } from 'react';
import '../Styles/ManagerNav.css';

interface ManagerNavProps {
    setActiveSection: (section: string) => void;
}

const ManagerNav: React.FC<ManagerNavProps> = ({ setActiveSection }) => {
    const [openSection, setOpenSection] = useState<string>('');

    const toggleSection = (section: string) => {
        const newSection = openSection === section ? '' : section;
        setOpenSection(newSection);
        setActiveSection(newSection);
    };

    const navItems = ['User', 'Menu', 'Inventory', 'Orders', 'Analytics'];

    return (
        <nav className="manager-nav">
            {navItems.map((item) => (
                <div className={`nav-item ${openSection === item ? 'active' : ''}`} key={item}>
                    <button
                        onClick={() => toggleSection(item)}
                    >
                        {item}
                    </button>
                </div>
            ))}
        </nav>
    );
};

export default ManagerNav;
