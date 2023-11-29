import React, { useState, ChangeEvent, useEffect } from 'react';  
import { Multiselect } from 'multiselect-react-dropdown';
import axios from 'axios';
import { Item, Topping } from '../../Order';

interface displayItem {
    family_id: number;
    family_name: string;
    family_category: string;
    family_description: string;
}

interface AddToppingModalProps {
    item: displayItem;
    sizeItem: Item;
    closeModal: () => void;
    addTopping: (toppings: Topping[], item: Item) => void;
    addItem: (item: Item) => void;
}

interface Topping2 {
    topping_id: number;
    family_id: number;
    topping: string;
    topping_price: number;
}

interface Data{
    data: Topping2[];
}

const AddToppingModal: React.FC<AddToppingModalProps> = ({ item, sizeItem, closeModal, addTopping, addItem}) => {
    const [options, setOptions] = useState<Topping[]>([])

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

    const handleSelectChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log(value);
        setOptions(prevOptions =>
            prevOptions.map(option =>
                option.name === value ? { ...option, chosen: !option.chosen } : option
            )
        );
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        addTopping(options, sizeItem);
        addItem(sizeItem);
        closeModal();
    }

    return (
        <div className='modal-container'
            onClick={(e) => {
                const target = e.target as HTMLTextAreaElement;
                if (target.className === "modal-container") closeModal();
            }}>
            <div className='modal'>
                <h3>Add Topping</h3>
                <form action="">
                    <div className='form-group'>
                        {
                            options.map((option, idx) => (
                            <div key={idx}>
                                <input type="checkbox" name={option.name} value={option.name} onChange={handleSelectChange}/>
                                <label htmlFor={option.name}><i>{option.name} + ${option.price}</i></label>
                            </div>
                            ))
                        }
                    </div>
                    <button className='btn' onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddToppingModal;