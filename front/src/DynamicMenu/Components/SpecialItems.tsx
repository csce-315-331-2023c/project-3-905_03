import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {formatCamelCase} from '../../SharedComponents/itemFormattingUtils.ts';

interface Row {
    item_id: number;
    served_item: string;
    item_price: number;
    family_id: 0;
}

interface Data {
    data: Row[];
}

const SpecialItems: React.FC = () => {
    const [items, setItems] = useState<Row[]>([]);

    useEffect(() => {
    
        axios.post('/getServedItemsInFamily', { "family_id" : 37 })
        .then(res => {
            const data: Data = res.data;
            setItems(data.data);
        })
        .catch(err => {
            console.log('Error:', err); // Log any errors from the axios.get call
        });
    });

    return (
        <span>
            {items && items.map((item, index) => (
            <div className = "menuItems" key={item.item_id}>
                <div className="menuItem">
                    {formatCamelCase(item.served_item)} : {item.item_price}
                </div>
            </div>
        ))}
        </span>
    );
};

export default SpecialItems;