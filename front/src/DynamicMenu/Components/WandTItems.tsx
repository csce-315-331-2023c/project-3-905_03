import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {dropLastWord, getSize, formatCamelCase } from '../../SharedComponents/itemFormattingUtils.ts';

const WandTItems: React.FC = () => {
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
    
    let prevItem: string = "start";
    return (
        <div className = "items">
            {rows.reduce((acc, row) => {
            let currItem: string = dropLastWord(row.served_item);
            let currItemSize: string = getSize(row.served_item);
            if (currItem.includes(prevItem)) {
                acc[acc.length - 1].sizes.push({ size: currItemSize, price: row.item_price });
            } else {
                prevItem = currItem;
                acc.push({ name: currItem, sizes: [{ size: currItemSize, price: row.item_price }] });
            }
            return acc;
        }, []).map((item: { name: string, sizes: { size: string, price: number }[] }) => (
            <div key={item.name}>
                {item.name.split(' ').map(word => formatCamelCase(word)).join(' ')} {item.sizes.map(size => <span key={size.size}>{size.size} ${size.price} </span>)}
            </div>
        ))}
        </div>
    );
};

export default WandTItems;
