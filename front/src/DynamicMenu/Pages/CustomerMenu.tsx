import React from 'react';
import '../Styles/CustomerMenu.css';
import logo from '../../assets/messLogo-removebg.png';
import nuttellaWaffle from '../../assets/nuttellaWaffle.jpg';
import originalFrenchToast from '../../assets/originalFrenchToast.jpg';
import cookieButterWaffle from '../../assets/cookieButterWaffle.jpg';
import chickenSandwich from '../../assets/chickenSandwich.jpg';
import chickenAndWaffle from '../../assets/chickenAndWaffle.jpg';
import brisketMac from '../../assets/brisketMac.jpg';
import cajunMacAndCheese from '../../assets/cajunMacAndCheese.jpg';
import eggSandwich from '../../assets/eggSandwich.jpg';


import EntreeItems from '../Components/EntreeItems';
import WandTItems from '../Components/WandTItems';
import SideItems from '../Components/SideItems';
import DrinkItems from '../Components/DrinkItems';
import SpecialItems from '../Components/SpecialItems';
import Weather from '../../SharedComponents/Weather';

const CustomerMenu: React.FC = () => {
    return (
        <div className="customer-menu-container">
            <div className="header">
                <img src={logo} alt="Mess Logo" />
                <div className="header-text">WELCOME TO MESS WAFFLES!</div>
            </div>
            <div className="menu-container">
                <div className="side-left">
                    <div className="WandTContainer">
                        <h1>Waffles And Toast</h1>
                        {<WandTItems />}  
                    </div>
                    <div className="pictureContainer">
                        <img src={originalFrenchToast} alt="Original French Toast" />
                        <img src={nuttellaWaffle} alt="Nuttella Waffles" />
                        <img src={cookieButterWaffle} alt="Reeses PB&J Waffle" />
                    </div>
                    <div className="bottomLeftContainer">
                        <h1>Sides</h1>
                        {<SideItems />}  
                    </div>
                    <div className="bottomRightContainer">
                        <h1>Drinks</h1>
                        {<DrinkItems />}  
                    </div>
                </div>
                <div className="side-right">
                    <div className="entreeContainer">
                        <h1>Entrees</h1>
                        {<EntreeItems />}  
                    </div>
                    <div className="pictureContainer">
                        <img src={chickenAndWaffle} alt="Chicken And Waffles" />
                        <img src={chickenSandwich} alt="Chicken Sandwich" />
                        <img src={brisketMac} alt="Brisket Mac" />
                        <img src={cajunMacAndCheese} alt="Cajun Mac And Cheese" />
                        <img src={eggSandwich} alt="Egg Sandwich" />
                    </div>
                    <div className="bottomLeftContainer">
                        <h1>Specials</h1>
                        {<SpecialItems />}
                    </div>
                    <div className="bottomRightContainer">
                        <h1>Weather</h1>
                        <Weather />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerMenu;