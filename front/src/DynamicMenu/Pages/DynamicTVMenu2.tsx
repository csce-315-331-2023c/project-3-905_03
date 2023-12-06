import React from 'react';
import '../Styles/DynamicMenu.css';
import chickenSandwich from '../../assets/chickenSandwich.jpg';
import chickenAndWaffle from '../../assets/chickenAndWaffle.jpg';
import brisketMac from '../../assets/brisketMac.jpg';
import cajunMacAndCheese from '../../assets/cajunMacAndCheese.jpg';
import eggSandwich from '../../assets/eggSandwich.jpg';
import logo from '../../assets/messLogo-removebg.png';

import EntreeItems from '../Components/EntreeItems';
import SpecialItems from '../Components/SpecialItems';
import Weather from '../../SharedComponents/Weather';

import Carousel from 'react-material-ui-carousel'

/**
 * `DynamicTVMenu2` is a React component that displays a dynamic TV menu.
 * 
 * @remarks
 * This component displays a carousel of menu items, including entrees and specials, and weather information.
 * The carousel auto-plays, with each slide displayed for a certain duration.
 * 
 * @returns The rendered `DynamicTVMenu2` component
 */
const DynamicTVMenu2: React.FC = () => {
    return (
        <div className="dynamic-menu-container">
            <div className="header">
                <img src={logo} alt="Mess Logo" />
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

export default DynamicTVMenu2;
