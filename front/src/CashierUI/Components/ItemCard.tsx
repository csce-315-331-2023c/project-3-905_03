import React from 'react';
import { Card, CardHeader, CardContent, CardActionArea, Typography, Box } from '@material-ui/core';
import { dropLastWord } from '../../SharedComponents/itemFormattingUtils';

interface menuItem {
    item_id: number;
    served_item: string;
    item_price: number;
}

interface ItemCardProps {
    item: menuItem;
    addItem: (id: number, name: string, price: number, quantity: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ( {item, addItem} ) => {
    return (
        <Box display="flex" justifyContent="center">
            <Card variant='outlined' square onClick={() => addItem(item.item_id, item.served_item, item.item_price, 1)}>
                <CardActionArea>
                    <CardHeader
                        title={
                            <Typography variant="h6" align="center">
                                {item.served_item}
                            </Typography>
                        }
                    />
                    <CardContent>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    );
}

export default ItemCard;