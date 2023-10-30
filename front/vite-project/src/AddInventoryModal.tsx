import React, {useState, ChangeEvent} from 'react';
import "./AddMenuModal.css";

interface Row {
    stock_id: number;
    stock_item: string;
    cost: string;
    stock_quantity: string;
    max_amount: string;
}

interface AddInventoryModalProps {
    closeModal: () => void
    onSubmit: (newRow: Row) => void
}

const AddInventoryModal: React.FC<AddInventoryModalProps> = ({closeModal, onSubmit}) => {
    const [formState, setFormState] = useState(
        {stock_id: 3, stock_item: "", cost: "", stock_quantity: "", max_amount: ""}
    )

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
                        <label htmlFor="stock_item" className='form-label'>Stock Name</label>
                        <input name="stock_item" value={formState.stock_item} onChange={handleFormChange}/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="cost" className='form-label'>Stock Cost</label>
                        <input name="cost" value={formState.cost} onChange={handleFormChange}/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="stock_quantity" className='form-label'>Stock Quantity</label>
                        <input name="stock_quantity" value={formState.stock_quantity} onChange={handleFormChange}/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="max_amount" className='form-label'>Maximum Amount</label>
                        <input name="max_amount" value={formState.max_amount} onChange={handleFormChange}/>
                    </div>
                    <button className='btn' onClick={handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default AddInventoryModal