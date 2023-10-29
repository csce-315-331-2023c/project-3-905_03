import React, {useState, ChangeEvent} from 'react';
import {Multiselect} from 'multiselect-react-dropdown';
import "./AddMenuModal.css";

function AddMenuModal () {
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
        <div className='modal-container'>
            <div className='modal'>
                <form action="">
                    <div>
                        <label htmlFor="name" className='form-label'>Item Name</label>
                        <input type="served_item" />
                    </div>
                    <div>
                        <label htmlFor="price" className='form-label'>Item Price</label>
                        <input type="item_price" />
                    </div>
                    <div>
                        <label htmlFor="Select Ingredient(s)" className='form-label'>Select Ingredients</label>
                        <Multiselect isObject={false} options={options} className='ingredient-select'/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddMenuModal