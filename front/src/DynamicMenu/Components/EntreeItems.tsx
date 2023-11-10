import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EntreeItems: React.FC = () => {
    interface Row {
        item_id: number;
        served_item: string;
        item_price: number;
    }

    interface Data {
        data: Row[];
    }

    const [rows, setRows] = useState<any[]>([]);
    
    let maxItemId = -1;
    for (let row of rows) {
        if (row.item_id > maxItemId) {
            maxItemId = row.item_id;
        }
    }

    const fetchMenuItems = () => {
        axios.get('http://localhost:8080/getServedItems')
            .then(res => {
                const data: Data = res.data;
                setRows(data.data);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    return (
        <div>
            {rows.map((row) => (
                <div key={row.item_id}>
                    <div>{row.served_item} ${row.item_price}</div>
                </div>
            ))}
        </div>
    );
};

export default EntreeItems;
