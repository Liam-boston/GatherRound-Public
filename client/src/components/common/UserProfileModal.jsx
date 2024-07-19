import React from 'react';
import { useEffect, useState } from 'react';
import './UserProfileModal.css';
import { CgProfile } from 'react-icons/cg';

const UserProfileModal = ({show, onClose, logOut, userData}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    // Fetch user data
    useEffect(() => {
        if(!userData){
            setError('no data')
        }else{
            setName(userData.name);
            setEmail(userData.email);
        }
    });
    

    // Hide modal
    if(!show){
        return null;
    }

    return (
        <div className='user-profile-modal__wrapper' data-testid='profile-modal'>
            <div className='user-profile-modal__content'>
                <h2>User Profile</h2>
                <div className='user-profile-modal__info'>
                    <p data-testid='name'>{'Name: ' + name}</p>
                    <p data-testid='email'>{'Email: ' + email} </p>
                 </div>
                 <div className='user-profile-modal__buttons'>
                    <button className='user-profile-modal__close' type='button' onClick={onClose} data-testid='profile-close'>Close</button>
                    <button className='user-profile-modal__logout' data-testid='logOut' onClick={logOut}> Logout </button>
                </div>
            </div>
        </div>
    );
}

export default UserProfileModal;