import React from 'react';
import '../Styles/DynamicMenu.css';
import logo from '../Styles/messLogo.jpg';
import EntreeItems from '../Components/EntreeItems';

const DynamicMenu: React.FC = () => {
    return (
        <div className="dynamic-menu-container">
            <div className="header">
                <img src={logo} alt="Mess Logo" />
                <div className="header-text">WELCOME TO MESS WAFFLES!</div>
            </div>
            <div className="entreeContainer">
                <h1>Entrees</h1>
                {<EntreeItems />}  
            </div>
            <div className="sidesContainer">
                <h1>Sides</h1>
                {/* sides Items will go here */}  
            </div>
            <div className="drinkContainer">
                <h1>Drinks</h1>
                {/* Drink Items will go here */}  
            </div>
        </div>
    );
};

export default DynamicMenu;
