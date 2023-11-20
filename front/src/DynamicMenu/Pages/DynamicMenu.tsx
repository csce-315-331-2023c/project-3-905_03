import React from 'react';
import '../Styles/DynamicMenu.css';
import logo from '../Styles/messLogo.jpg';
import EntreeItems from '../Components/EntreeItems';
import WandTItems from '../Components/WandTItems';
import SideItems from '../Components/SideItems';
import DrinkItems from '../Components/DrinkItems';
import SpecialItems from '../Components/SpecialItems';
import Weather from '../Components/Weather';

import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'

const DynamicMenu: React.FC = () => {
    return (
        <div className="dynamic-menu-container">
            <div className="header">
                <img src={logo} alt="Mess Logo" />
                <div className="header-text">WELCOME TO MESS WAFFLES!</div>
            </div>

            <Carousel className ="mainCarousel"
                autoPlay={true}
                interval={10000}
                animation="slide"
                duration={500}
                swipe={true}
                navButtonsAlwaysInvisible={true}
                indicators={false}
            >
                <div className="WandTContainer">
                    <h1>Waffles And Toast</h1>
                    {<WandTItems />}  
                </div>
                <div className="entreeContainer">
                    <h1>Entrees</h1>
                    {<EntreeItems />}  
                </div>
            </Carousel>

            <Carousel className ="bottomLeftCarousel"
                autoPlay={true}
                interval={10000}
                animation="slide"
                duration={500}
                swipe={true}
                navButtonsAlwaysInvisible={true}
                indicators={false}
            >
                <div className="sidesContainer">
                    <h1>Sides</h1>
                    {<SideItems />}  
                </div>
                <div className="drinkContainer">
                    <h1>Drinks</h1>
                    {<DrinkItems />}  
                </div>
            </Carousel>

            <Carousel className ="bottomRightCarousel"
                autoPlay={true}
                interval={10000}
                animation="slide"
                duration={500}
                navButtonsAlwaysInvisible={true}
                indicators={false}
            >
                <div className="weatherContainer">
                    <h1>Weather</h1>
                    <Weather />
                </div>
                <div className="specialsContainer">
                    <h1>Specials</h1>
                    {<SpecialItems />}  
                </div>
            </Carousel>
        </div>
    );
};

export default DynamicMenu;
