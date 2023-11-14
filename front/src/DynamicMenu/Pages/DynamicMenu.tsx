import React from 'react';
import '../Styles/DynamicMenu.css';
import logo from '../Styles/messLogo.jpg';
import EntreeItems from '../Components/EntreeItems';
import SideItems from '../Components/SideItems';
import DrinkItems from '../Components/DrinkItems';
import Weather from '../Components/Weather';

const DynamicMenu: React.FC = () => {
    return (
        <div className="dynamic-menu-container">
            <div className="header">
                <img src={logo} alt="Mess Logo" />
                <div className="header-text">WELCOME TO MESS WAFFLES!</div>
                <div className="weatherContainer">
                    <Weather />
                </div>
            </div>
            <div className="entreeContainer">
                <h1>Entrees</h1>
                {<EntreeItems />}  
            </div>
            <div className="sidesContainer">
                <h1>Sides</h1>
                {<SideItems />}  
            </div>
            <div className="drinkContainer">
                <h1>Drinks</h1>
                {<DrinkItems />}  
            </div>
        </div>
    );
};

export default DynamicMenu;
