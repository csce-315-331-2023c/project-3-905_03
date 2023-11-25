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

const DynamicMenu: React.FC = () => {
    return (
        <div className="dynamic-menu-container">
            <div className="header">
                <img src={logo} alt="Mess Logo" />
                <div className="header-text">WELCOME TO MESS WAFFLES!</div>
                <Weather />
            </div>

            <Carousel className ="Carousel"
                autoPlay={true}
                interval={10000}
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
                    <div className="bottomLeftContainer">
                        <h1>Specials</h1>
                        {<SpecialItems />}
                    </div>
                    <div className="bottomRightContainer">
                        <h1>FOTM</h1>
                    </div>
                </div>
                </Carousel>
        </div>
    );
};

export default DynamicMenu;
