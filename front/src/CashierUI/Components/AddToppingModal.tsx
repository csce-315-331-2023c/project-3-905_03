import React, { useState, ChangeEvent, useEffect } from 'react';  
import { Multiselect } from 'multiselect-react-dropdown';
import axios from 'axios';
import { Item, Topping } from '../../Order';
import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

/**
 * Interface for displayItem
 */
interface displayItem {
    family_id: number;
    family_name: string;
    family_category: string;
    family_description: string;
}

/**
 * Interface for AddToppingModalProps
 */
interface AddToppingModalProps {
    item: displayItem;
    sizeItem: Item;
    closeModal: () => void;
    addTopping: (toppings: Topping[], item: Item) => void;
    addItem: (item: Item) => void;
}

/**
 * Interface for Topping2
 */
interface Topping2 {
    topping_id: number;
    family_id: number;
    topping: string;
    topping_price: number;
}

/**
 * Interface for Data
 */
interface Data{
    data: Topping2[];
}

/**
 * AddToppingModal component
 * @param {AddToppingModalProps} props - Component props
 */
const AddToppingModal: React.FC<AddToppingModalProps> = ({ item, sizeItem, closeModal, addTopping, addItem}) => {
    const [options, setOptions] = useState<Topping[]>([])

    /**
     * Fetch toppings for each served item family on component mount
     */
    useEffect(() => {
        axios.post('/getToppingsInFamily', {family_id: item.family_id})
            .then(res => {
                console.log(res.data.data.length);
                if (res.data.data.length === 0){
                    addItem(sizeItem);
                    closeModal();
                }else{
                    const data: Data = res.data;
                    const toppings: Topping[] = data.data.map(topping => ({
                        id: topping.topping_id,
                        name: topping.topping,
                        price: topping.topping_price,
                        chosen: false}));
                    setOptions(toppings);
                }
            })
            .catch(er => console.log(er));
    }, []);

    /**
     * Handle change in checbox selection
     * @param {ChangeEvent<HTMLInputElement>} e - Event
     */
    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log(value);
        setOptions(prevOptions =>
            prevOptions.map(option =>
                option.name === value ? { ...option, chosen: !option.chosen } : option
            )
        );
    };

    /**
     * Handle form submission of toppings
     * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e - Event
     */
    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        addTopping(options, sizeItem);
        addItem(sizeItem);
        closeModal();
    }

    /**
     * Render the component
     */
    return (
        // Modal container
        <div className='modal-container'>
            <div className='modal' style={{color: 'black'}}>
                <h3>Add Toppings</h3>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        >
                        <div /*style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} */>
                            {
                                // Map over options and render a checkbox for each option
                                options.map((option, idx) => (
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox onChange={handleSelectChange} value={option.name}/>} label={<i>{option.name} + ${option.price}</i>}/>
                                    </FormGroup>
                                ))
                            }
                        </div>
                        <div style={{ display: 'flex', gap: '5px'}}>
                            <button className='btn' onClick={handleSubmit}>Submit</button>
                            <button className='btn' onClick={() => closeModal()}>Cancel</button>
                        </div>
                    </Box>
            </div>
        </div>
    );
};

export default AddToppingModal;