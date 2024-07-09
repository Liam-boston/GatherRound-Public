import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom"; 
import { signOut, getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from "../../services/firebase";
import {Link} from "react-router-dom";
import ProfileButton from "../common/ProfileButton/ProfileButton";
import CreateButton from "../common/CreateButton/CreateButton"; 
import CreateClubModal from "./CreateClubModal";
import "./Homepage.css"; 

function Homepage() {
    const [clubs, setClubs] = useState([]); // State to hold the list of clubs stored in Firestore
    const [currentUser, setCurrentUser] = useState(null); // State to store the current user
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [message, setMessage] = useState(null); // State to hold the success or failure message

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

    // Fetch clubs from Firestore
    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Clubs')); // Fetch the Clubs collection
                const clubsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setClubs(clubsList); // Update state with fetched clubs
                console.log(clubs, clubsList)
            } catch (error) {
                console.error("Error fetching clubs: ", error);
            }
        };

        fetchClubs(); // Call fetchClubs when component mounts or currentUser changes
    }, [currentUser]);

    // Function to handle showing the modal
    const viewModal = () => {
        setMessage(null); // Reset the message when the modal is opened
        setShowModal(true); // Show the modal when Create Club is clicked
    }

    // Function to handle closing the modal
    const closeModal = () => {
        setShowModal(false); // Close the modal
    }

    // Function to sign authenticated user out
    const logOut = () => {
         signOut(auth)
         return <Navigate to="/"/>;
    }

    // Function to set the success or failure message
    const handleSetMessage = (newMessage) => {
        setMessage(newMessage);
        setTimeout(() => {
            setMessage(null);
        }, 3000); // Hide the message after 3 seconds
    };

    // Function to handle profile button click
    const handleProfileClick = () => {
        // TODO: Implement profile button
    };

    return (
        <div>
            <ProfileButton onClick={handleProfileClick} />
            <div className='header'>
                <h1>GatherRound</h1>
                <p>Let the games begin!</p>
                <button onClick={logOut}> Logout </button>
            </div>
            <div className='homepage-wrapper'>
                <div className='scrollable-list'>
                    {/* Scrollable list of club buttons */}
                    {clubs.map((club) => (
                         <Link to={`Clubs/${club.name}`} className='club-button'>{club.name}</Link>
                         //Previous functionality
                        //<button onClick={(e) => navigate('Clubs/${club}')} key={index} className='club-button'>{club.name}
                        //</button>
                    ))}
                </div>
                {/* Display the success or failure message upon club creation */}
                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
                <div>
                    {/* Create club button */}
                    <CreateButton onClick={viewModal} />
                </div>
                <div className='create-club-modal'>
                    {/* Render the modal */}
                    <CreateClubModal show={showModal} onClose={closeModal} setMessage={handleSetMessage} currentUser={currentUser} />
                </div>
            </div>
        </div>
    );
}

export default Homepage;