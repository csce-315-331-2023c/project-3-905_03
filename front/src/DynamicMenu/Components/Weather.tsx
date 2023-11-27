import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather: React.FC = () => {
    const [temp, setTemp] = useState<number | null>(null);
    const [icon, setIcon] = useState<string | null>(null);

    const fetchWeather = () => {
        axios.get('https://api.openweathermap.org/data/2.5/weather?lat=30.6280&lon=-96.3344&appid=8f1c1700dbf312e8c8db03f700c214d4&lang=en&units=imperial')
            .then(res => {
                const temp: number = res.data.main.temp;
                const icon: string = res.data.weather[0].icon;
                setTemp(temp);
                setIcon(icon);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchWeather();
    }, []);
    
    return (
        <div className="weather">
            <div className="weather-info">
                {icon && <img className="weatherIcon" src={`http://openweathermap.org/img/w/${icon}.png`} alt="Weather icon" />}
                {temp?.toFixed(1)} &#176;F
            </div>
            <div className="weather-message">
                {temp && temp < 60 ? <p>It's too cold to eat outside!</p> : null}
                {temp && temp > 90 ? <p>It's too hot to eat outside!</p> : null}
                {temp && temp >= 60 && temp <= 90 ? <p>Its great weather to enjoy our outdoor seating!</p> : null}
            </div>
        </div>
    );
};

export default Weather;