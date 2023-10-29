import React, {useState, ChangeEvent} from 'react';
import {Multiselect} from 'multiselect-react-dropdown';
import "./AddMenuModal.css";

interface AddMenuModalProps {
    closeModal: () => void
}

const AddMenuModal: React.FC<AddMenuModalProps> = ({closeModal}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
    const options = [
        'New Ingredient',
        'chicken',
        'waffles',
        'eggs',
        'bread',
        'strawberries',
    ];

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedIngredients = Array.from(
            e.target.selectedOptions,
            (option) => option.value
          );
          setSelectedOptions(selectedIngredients);
    };    

    return (
        <div className='modal-container' onClick={closeModal}>
            <div className='modal'>
                <form action="">
                    <div className='form-group'>
                        <label htmlFor="name" className='form-label'>Item Name</label>
                        <input type="served_item" />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="price" className='form-label'>Item Price</label>
                        <input type="item_price" />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="Select Ingredient(s)" className='form-label'>Select Ingredients</label>
                        <Multiselect isObject={false} options={options} className='ingredient-select'/>
                    </div>
                    <button className='btn'>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default AddMenuModal