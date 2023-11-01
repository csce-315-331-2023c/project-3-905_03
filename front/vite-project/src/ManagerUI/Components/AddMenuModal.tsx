import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios'
import { Multiselect } from 'multiselect-react-dropdown';
import "../Styles/AddMenuModal.css";

interface Row {
    item_id: number;
    served_item: string;
    item_price: number;
}

interface stockData {
    data: Array<{ stock_item: string }>
}

interface AddMenuModalProps {
    closeModal: () => void
    onSubmit: (newRow: Row) => void
    maxID: number
}

const AddMenuModal: React.FC<AddMenuModalProps> = ({ closeModal, onSubmit, maxID }) => {
    const [options, setOptions] = useState<any[]>([])
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [formState, setFormState] = useState(
        { item_id: ++maxID, served_item: "", item_price: 0 }
    )



    useEffect(() => {
        axios.get('http://localhost:8080/getStockItems')
            .then(res => {
                const data: stockData = res.data;
                const stockitems: string[] = data.data.map(item => item.stock_item)
                setOptions(stockitems)
            })
            .catch(er => console.log(er));
    }, []);

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
        const axiosRequests = selectedOptions.map(selectedOption =>
            axios.post('http://localhost:8080/addServedItemStockItem', (formState.served_item, selectedOption))
        );
        Promise.all(axiosRequests)
            .then(responses => {
                closeModal();
            })
            .catch(error => {
                console.error('Error sending requests:', error);
            });
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
                        <input name="served_item" value={formState.served_item} onChange={handleFormChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="price" className='form-label'>Item Price</label>
                        <input name="item_price" value={formState.item_price} onChange={handleFormChange} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="Select Ingredient(s)" className='form-label'>Select Ingredients</label>
                        <Multiselect isObject={false} options={options} className='ingredient-select' onSelect={handleSelectChange} />
                    </div>
                    <button className='btn' onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default AddMenuModal