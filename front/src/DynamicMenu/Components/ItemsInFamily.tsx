import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {getSize} from '../../SharedComponents/itemFormattingUtils.ts';

interface Row {
    item_id: number;
    served_item: string;
    item_price: number;
    family_id: 0;
}

interface Data {
    data: Row[];
}

interface Props {
    family_id: number;
}

/**
 * `ItemsInFamily` is a React component that fetches and displays the items in a specific family.
 * 
 * @remarks
 * This component fetches the items in a specific family from the server, stores them in the state, and displays them.
 * Each item is displayed with its size and price.
 * 
 * @param family_id - The ID of the family to fetch the items for
 * 
 * @returns The rendered `ItemsInFamily` component
 */
const ItemsInFamily: React.FC<Props> = ({ family_id }) => {
    const [items, setItems] = useState<Row[]>([]);

    useEffect(() => {
    
        axios.post('/getServedItemsInFamily', { family_id })
        .then(res => {
            const data: Data = res.data;
            setItems(data.data);
        })
        .catch(err => {
            console.log('Error:', err); // Log any errors from the axios.get call
        });
    }, [family_id]);

    return (
        <span>
            {items && items.map((item, index) => (
            <span key={item.item_id}>
                {items.length > 1 ? (
                    <>
                        {index > 0 && <span className="sizeSeparator"> | </span>}
                        {getSize(item.served_item)}: {item.item_price}
                    </>
                ) : (
                    // Render the item differently if it's the only member of its family
                    <span className="singleItem">
                        : {item.item_price}
                    </span>
                )}
            </span>
        ))}
        </span>
    );
};

export default ItemsInFamily;