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
}

const ItemCard: React.FC<ItemCardProps> = ( {item} ) => {
    return (
        <Box display="flex" justifyContent="center">
            <Card variant='outlined' square>
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