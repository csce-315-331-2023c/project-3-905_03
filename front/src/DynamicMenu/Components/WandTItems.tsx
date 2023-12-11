import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemsInFamily from './ItemsInFamily.tsx';

/**
 * `WandTItems` is a React component that fetches and displays the wine and tea items.
 * 
 * @remarks
 * This component fetches the wine and tea items from the server, stores them in the state, and displays them.
 * Each item is displayed with its name and a description.
 * 
 * @returns The rendered `WandTItems` component
 */
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