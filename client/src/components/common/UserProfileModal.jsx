import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import './UserProfileModal.css';

const UserProfileModal = ({show, onClose, logOut, currentUser}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    // useEffect(() => {
    //     const docRef = doc(db, 'Users', userId);
    //     getDoc(docRef)
    //     .then((snapshot) => {
    //         setName(snapshot.get('name'));
    //         setEmail(snapshot.get('email'));
    //         setError('');
    //     })
    //     .catch(err => {
    //         setError(err.message);
    //         console.log(error);
    //     });
    // });
    useEffect(() => {
        if(!currentUser){
            setError('User not logged in.');
        }else{
            setName(currentUser.name);
            setEmail(currentUser.email);
        }
    });
    

    if(!show){
        return null;
    }

    return (
        <div className='user-profile-modal__wrapper' data-testid='modal'>
            <div className='user-profile-modal__content'>
                <button data-testid='close' onClick={onClose}>close</button>
                <h2>User Profile</h2>
                <div className='user-profile-modal__info'>
                    <p data-testid='name'>{'Name: ' + name}</p>
                    <p data-testid='email'>{'Email: ' + email} </p>
                    <button data-testid='logOut' onClick={logOut}> Logout </button>
                </div>
            </div>
        </div>
    );
}

export default UserProfileModal;