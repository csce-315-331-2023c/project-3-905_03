import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Item, Topping } from '../../Order.ts';
import axios from 'axios';
import { getSize } from '../../SharedComponents/itemFormattingUtils.ts';
import AddToppingModal from './AddToppingModal.tsx';
import InfoIcon from '@mui/icons-material/Info';
import { IconButton } from '@mui/material';


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
    addTopping: (toppings: Topping[], item: Item) => void;
}

/**
 * `ItemCard` is a React component that displays an item card.
 * 
 * @remarks
 * This component fetches the sizes and toppings for an item from the server, stores them in the state, and displays them in a card.
 * The user can select a size and toppings, and add the item to their order.
 * 
 * @param item - The item to display
 * @param addItem - Function to add the item to the order
 * @param addTopping - Function to add the selected toppings to the item
 * 
 * @returns The rendered `ItemCard` component
 */
const ItemCard: React.FC<ItemCardProps> = ({ item, addItem, addTopping }) => {
    const [state, upd] = useState(false);
    const [sizes, setSizes] = useState<Items[]>([]);
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [toppingModal, setToppingModal] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [sizeItem, setSizeItem] = useState<Item>({id: 0, name: "", price: 0, category: ""});

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
                    setIsClicked(true);
                }else{
                    const tempItem: Item = {
                        id: data.data[0].item_id,
                        name: data.data[0].served_item,
                        price: data.data[0].item_price,
                        category: item.family_category,
                    }
                    setIsClicked(false);
                    setSizeItem(tempItem);
                    setModalOpen(true);
                }
                
            })
            .catch(err => console.log(err));
    };

    const handleSizeClick = (item: Item) => {
        setSizeItem(item);
        setIsClicked(false);
        setModalOpen(true);
    };

    const displayInfo = () => {
        alert(item.family_description);
    }

    return (
        <div>
            <Box justifyContent="center">
                {isClicked === false ? (
                    <Box sx={{ '&:hover': { backgroundColor: 'lightgrey' } }}>
                        <Card elevation={13} variant='outlined' square onClick={() => {getSizes(item.family_id);}}>
                            <CardActionArea>
                                <CardHeader
                                    title={
                                        <Typography variant="h6" align="center" style={{color: "black", fontSize: "15px", gap: '5px'}}>
                                            {item.family_name}
                                            <IconButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => {displayInfo(); e.stopPropagation();}}>
                                                <InfoIcon/>
                                            </IconButton>
                                        </Typography>
                                    }
                                />
                                <CardContent>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                        {modalOpen && <AddToppingModal key={item.family_id} closeModal={() => (
                        setModalOpen(false)
                        )} item={item} sizeItem={sizeItem} addTopping={addTopping} addItem={addItem}/>}
                    </Box>
                ) : (
                    <Card variant='outlined' square onClick={() => {setIsClicked(false)}} elevation={13}>
                        <CardActionArea>
                            <CardHeader
                                title={
                                    <Typography variant="h6" align="center" style={{color: "black", fontSize: "15px"}}>
                                        {item.family_name}
                                        <IconButton onClick={() => {displayInfo()}}>
                                                <InfoIcon/>
                                        </IconButton>
                                    </Typography>
                                }
                            />
                            <CardContent>
                                {sizes.map(size => {
                                    const sizeItem2: Item = {
                                        id: size.item_id,
                                        name: size.served_item,
                                        price: size.item_price,
                                        category: size.category,
                                    };
                                    return (
                                        <Box sx={{ '&:hover': { backgroundColor: 'lightgrey' } }}>
                                            <Card elevation={13} variant='outlined' square onClick={() => { handleSizeClick(sizeItem2) }}>
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
                                            {modalOpen && <AddToppingModal key={item.family_id} closeModal={() => (
                                            setModalOpen(false)
                                            )} item={item} sizeItem={sizeItem} addTopping={addTopping} addItem={addItem}/>}
                                        </Box>
                                    );
                                })}
                            </CardContent>
                        </CardActionArea>
                    </Card>
                )}
            </Box>
        </div>
    );
}

export default ItemCard;
