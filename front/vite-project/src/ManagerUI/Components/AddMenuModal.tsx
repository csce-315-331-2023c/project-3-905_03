import React, {useState, ChangeEvent} from 'react';
import {Multiselect} from 'multiselect-react-dropdown';
import "../Styles/AddMenuModal.css";

interface Row {
    item_id: number;
    served_item: string;
    item_price: string;
}

interface AddMenuModalProps {
    closeModal: () => void
    onSubmit: (newRow: Row) => void
}

const AddMenuModal: React.FC<AddMenuModalProps> = ({closeModal, onSubmit}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [formState, setFormState] = useState(
        {item_id: 3, served_item: "", item_price: ""}
    )
  
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

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        onSubmit(formState)
        closeModal();
    }

    return (
        <div className='modal-container' 
        onClick={(e) => {
            const target = e.target as HTMLTextAreaElement
            if (target.className === "modal-container") closeModal();
            }}>
            <div className='modal'>
                <form action="">
                    <div className='form-group'>
                        <label htmlFor="name" className='form-label'>Item Name</label>
                        <input name="served_item" value={formState.served_item} onChange={handleFormChange}/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="price" className='form-label'>Item Price</label>
                        <input name="item_price" value={formState.item_price} onChange={handleFormChange}/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="Select Ingredient(s)" className='form-label'>Select Ingredients</label>
                        <Multiselect isObject={false} options={options} className='ingredient-select'/>
                    </div>
                    <button className='btn' onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default AddMenuModal