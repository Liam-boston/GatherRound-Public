import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
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
            console.log(err);
        });
    });

    if(!show){
        return null;
    }

    return (
        <div className='user-profile-modal__wrapper' data-testid='modal'>
            <div className='.user-profile-modal__content'>
                <h2>User Profile</h2>
                <div className='user-profile-modal__info'>
                    <p data-testid='name'>{'Name: ' + name}</p>
                    <p data-testid='email'>{'Email: ' + email} </p>
                </div>
            </div>
        </div>
    );
}

export default UserProfileModal;