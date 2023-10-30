import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManagerNav from '../Components/ManagerNav';


import '../Styles/Manager.css';

const ManagerGUI: React.FC = () => {
    const [data, setData] = useState<any>(null);


    useEffect(() => {
        // Example API call
        axios.get('/api/some-data')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching data", error);
            });
    }, []);

    return (

        <div className="manager-container">
            <div className="lhs">
                <ManagerNav />
            </div>
            <div className="rhs">
                <p>Note / Idea: Navbutton onclick calls modal for input and this page will reflect changes but up to u</p>
            </div>
        </div>
    );
};

export default ManagerGUI;