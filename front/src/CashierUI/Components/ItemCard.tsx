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
            <Card variant='outlined' square>
                <CardActionArea>
                    <CardHeader title={item.served_item} subheader={item.item_price}/>
                    <CardContent>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
}

export default ItemCard;