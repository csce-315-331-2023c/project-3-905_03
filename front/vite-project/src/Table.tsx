import React from 'react';
import "./Table.css";
import {BsFillPencilFill, BsFillTrashFill} from 'react-icons/bs'

function Table() {
    return (
        <div className='table-container'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th className='expand'>Item Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>0</td>
                        <td>chickenAndWafflesSnack</td>
                        <td>6.95</td>
                        <td>
                            <span className='actions'>
                                <BsFillPencilFill className="edit-btn"/>
                                <BsFillTrashFill className="delete-btn"/>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>chickenAndWafflesRegular</td>
                        <td>11.85</td>
                        <td>
                            <span className='actions'>
                                <BsFillPencilFill className="edit-btn"/>
                                <BsFillTrashFill className="delete-btn"/>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Table