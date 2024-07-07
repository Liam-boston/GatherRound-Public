import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, onSnapshot, collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import './UserProfileModal.css';

const UserProfileModal = ({show, onClose, userId}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const docRef = doc(db, 'Users', userId);
        getDoc(docRef)
        .then((snapshot) => {
            setName(snapshot.get('name'));
            setEmail(snapshot.get('email'));
            setError('');
        })
        .catch(err => {
            setError(err.message);
        });
    });

    if(!show){
        return null;
    }

    return (
        <div className='user-profile-modal__wrapper' data-testid='modal'>
            
            <div className='.user-profile-modal__content'>
                <button onClick={onClose}>Exit</button>
                <h2 data-testid='name'>{'Name: ' + name}</h2>
                <h2 data-testid='email'>{'Email: ' + email} </h2>
                <h2>{'Error:' + error}</h2>
            </div>
        </div>
    );
}

export default UserProfileModal;