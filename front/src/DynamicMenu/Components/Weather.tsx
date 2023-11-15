import React, {useState, useEffect } from 'react';
import axios from 'axios';

const Weather: React.FC = () => {

    const [temp, setTemp] = useState<number | null>(null);

    const fetchWeather = () => {
        axios.get('https://api.openweathermap.org/data/2.5/weather?lat=30.6280&lon=-96.3344&appid=8f1c1700dbf312e8c8db03f700c214d4&lang=en&units=imperial')
            .then(res => {
                const temp: number = res.data.main.temp;
                setTemp(temp);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchWeather();
    }, []);
    
    return (
        <div className="weather">
            {temp?.toFixed(1)} &#176;F
            {temp && temp < 60 ? <p>It's cold outside!</p> : null}
            {temp && temp > 90 ? <p>It's hot outside!</p> : null}
            {temp && temp >= 60 && temp <= 90 ? <p>It's nice outside!</p> : null}
        </div>
    );
};

export default Weather;