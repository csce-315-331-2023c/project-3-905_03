import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemsInFamily from './ItemsInFamily.tsx';

const WandTItems: React.FC = () => {
    interface Row {
        family_id: number;
        family_name: string;
        family_category: string;
        family_description: string;
    }

    interface Data {
        data: Row[];
    }

    const [rows, setRows] = useState<Row[]>([]); // Use Row[] instead of any[]

    const fetchWandTItems = () => {
        axios.get('/getW&TItems')
            .then(res => {
                const data: Data = res.data;
                setRows(data.data);
            })
            .catch(err => console.log(err));
    };
    
    useEffect(() => {
        fetchWandTItems();
    }, []);
    
    return (
        <div className = "menuItems">
            {rows.map((row, index) => (
                <div key={index} className="menuItem">
                    <span>{row.family_name} <ItemsInFamily family_id={row.family_id}/></span>
                    <div className = "menuItemDescription">{row.family_description}</div>
                </div>
            ))}
        </div>
    );
};

export default WandTItems;