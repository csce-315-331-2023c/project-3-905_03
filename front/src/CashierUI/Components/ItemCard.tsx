import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Item } from '../../Order.ts';

interface ItemCardProps {
    item: Item;
    addItem: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, addItem }) => {
    return (
        <Box justifyContent="center">
            <Card variant='outlined' square onClick={() => addItem(item)}>
                <CardActionArea>
                    <CardHeader
                        title={
                            <Typography variant="h6" align="center" style={{color: "black"}}>
                                {item.name}
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
