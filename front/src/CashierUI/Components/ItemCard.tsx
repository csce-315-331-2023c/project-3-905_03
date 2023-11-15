import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface MenuItem {
    item_id: number;
    served_item: string;
    item_price: number;
}

interface ItemCardProps {
    item: MenuItem;
    addItem: (id: number, name: string, price: number, quantity: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, addItem }) => {
    return (
        <Box justifyContent="center">
            <Card variant='outlined' square onClick={() => addItem(item.item_id, item.served_item, item.item_price, 1)}>
                <CardActionArea>
                    <CardHeader
                        title={
                            <Typography variant="h6" align="center" style={{color: "black"}}>
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
