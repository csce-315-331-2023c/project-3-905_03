import React from 'react';
import '../Styles/DynamicMenu.css';
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
import Weather from '../Components/Weather';

import Carousel from 'react-material-ui-carousel'

const DynamicMenu: React.FC = () => {
    return (
        <div className="dynamic-menu-container">
            <div className="header">
                <img src={logo} alt="Mess Logo" />
                <div className="header-text">WELCOME TO MESS WAFFLES!</div>
                
            </div>

            <Carousel className ="Carousel"
                autoPlay={true}
                interval={7500}
                animation="slide"
                duration={500}
                swipe={false}
                navButtonsAlwaysInvisible={true}
                indicators={false}
            > 
                <div className="slide">
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
                <div className="slide">
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
                </Carousel>
        </div>
    );
};

export default DynamicMenu;
