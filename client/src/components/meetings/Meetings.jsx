import "./Meetings.css"; 
import React, {useEffect, useState} from 'react';
//import { Navigate } from 'react-router-dom';
//import { useNavigate } from 'react-router-dom';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import ProfileButton from "../common/ProfileButton/ProfileButton";
import ClubDetails from "../clubs/ClubDetails";


function Meetings() {

    const navigate = useNavigate();
    const {state} = useLocation();
    const [currentUser, setCurrentUser] = useState(null); // State to store the current user
    const { id } = useParams();
    const { clubID } = state;

        // Fetch the current user from Firebase Auth
        useEffect(() => {
            const auth = getAuth();
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    setCurrentUser(user);
                } else {
                    setCurrentUser(null);
                }
            });
    
            // Clean up the subscription on unmount
            return () => unsubscribe();
        }, []);


    // Function to handle profile button click
    const handleProfileClick = () => {
        // TODO: Implement profile button click logic
    };


    return (
        <div>
             <ProfileButton onClick={handleProfileClick} />
            <div className='header'>
                <h1>Club Name</h1>
                <p>{clubID}</p>
                <button onClick={(e) => navigate(-1)}> Back to Club Page </button>
            </div>
        </div>
    );
    
}



export default Meetings

