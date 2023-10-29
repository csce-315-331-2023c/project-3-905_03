import React from 'react';
import "./AddMenuModal.css";

function AddMenuModal () {
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
                        <label htmlFor="ingredient" className='form-label'>Select Ingredients</label>
                        <select name="" id=""></select>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddMenuModal