import React from 'react';
import { FaPlus } from "react-icons/fa6";
import './CreateButton.css';

const CreateButton = ({ onClick }) => {
    return (
        <div className='create-button-container'>
            <button className='create-button' onClick={onClick}>
                <FaPlus className='icon' />
            </button>
            <span className='tooltip'>Create new</span>
        </div>
    );
};

export default CreateButton;
