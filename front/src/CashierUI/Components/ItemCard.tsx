import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Item } from '../../Order.ts';
import axios from 'axios';
import { getSize } from '../../SharedComponents/itemFormattingUtils.ts';

interface displayItem {
    family_id: number;
    family_name: string;
    family_category: string;
    family_description: string;
}

interface Items {
    item_id: number,
    served_item: string,
    item_price: number,
    family_id: number,
    category: string;
    size: string;
}

interface Data {
    data: Items[];
}

interface Data2 {
    data: Item[];
}

interface ItemCardProps {
    item: displayItem;
    addItem: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, addItem }) => {
    const [state, upd] = useState(false);
    const [sizes, setSizes] = useState<Items[]>([]);
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [toppingModal, setToppingModal] = useState<boolean>(false);

    const getSizes = (id: number) => {
        axios.post('/getServedItemsInFamily', {family_id: id})
            .then(res => {
                const data: Data = res.data;
                if (res.data.data.length > 1){
                    const sizes: Items[] = data.data.map(sItem => ({
                        ...sItem,
                        category: item.family_category,
                        size: getSize(sItem.served_item)
                    }));
                    setSizes(sizes);
                    upd(a => !a);
                }else{
                    const tempItem: Item = {
                        id: data.data[0].item_id,
                        name: data.data[0].served_item,
                        price: data.data[0].item_price,
                        category: item.family_category,
                    }
                    addItem(tempItem);
                    upd(a => !a);
                }
                
            })
            .catch(err => console.log(err));
    };

    return (
        <Box justifyContent="center">
            {isClicked === false ? (
                <Card elevation={13} variant='outlined' square onClick={() => {getSizes(item.family_id); setIsClicked(!isClicked); upd(a => !a);}}>
                    <CardActionArea>
                        <CardHeader
                            title={
                                <Typography variant="h6" align="center" style={{color: "black", fontSize: "15px"}}>
                                    {item.family_name}
                                </Typography>
                            }
                        />
                        <CardContent>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ) : (
                <Card variant='outlined' square elevation={13}>
                    <CardActionArea>
                        <CardHeader
                            title={
                                <Typography variant="h6" align="center" style={{color: "black", fontSize: "15px"}}>
                                    {item.family_name}
                                </Typography>
                            }
                        />
                        <CardContent>
                            {sizes.map(size => {
                                const sizeItem: Item = {
                                    id: size.item_id,
                                    name: size.served_item,
                                    price: size.item_price,
                                    category: size.category,
                                };
                                return (
                                    <Box sx={{ '&:hover': { backgroundColor: 'lightgrey' } }}>
                                        <Card elevation={13} variant='outlined' square onClick={() => { addItem(sizeItem); setIsClicked(!isClicked); }}>
                                            <CardActionArea>
                                                <CardHeader
                                                    title={
                                                        <Typography variant="h6" align="center" style={{color: "black", fontSize: "15px"}}>
                                                            {size.size}
                                                        </Typography>
                                                    }
                                                />
                                            </CardActionArea>
                                        </Card>
                                    </Box>
                                );
                            })}
                        </CardContent>
                    </CardActionArea>
                </Card>
            )}
        </Box>
    );
}

export default ItemCard;
