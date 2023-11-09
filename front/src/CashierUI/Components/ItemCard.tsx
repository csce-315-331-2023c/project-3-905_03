import React from 'react';
import { Card, CardHeader, CardContent, CardActionArea } from '@material-ui/core';

interface menuItem {
    item_id: number;
    served_item: string;
    item_price: number;
}

interface ItemCardProps {
    item: menuItem;
}

const ItemCard: React.FC<ItemCardProps> = ( {item} ) => {
    return (
        <div>
            <Card>
                <CardActionArea>
                    <CardHeader title={item.served_item} />
                    <CardContent>
                        <p>Price: ${item.item_price}</p>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
}

export default ItemCard;