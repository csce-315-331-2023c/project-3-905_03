import React from 'react';
import '../Styles/KitchenDisplay.css';
import logo from '../../assets/messLogo-removebg.png';


const KitchenDisplay: React.FC = () => {
    return (
        <div className="dynamic-menu-container">
            <div className="header">
                <img src={logo} alt="Mess Logo" />
                <div className="header-text">WELCOME TO MESS WAFFLES!</div>
            </div>
        </div>
    );
};

export default KitchenDisplay;
