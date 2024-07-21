import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom"; 
import { signOut, getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from "../../services/firebase";
import {Link} from "react-router-dom";
import ProfileButton from "../common/ProfileButton/ProfileButton";
import CreateButton from "../common/CreateButton/CreateButton"; 
import CreateClubModal from "./CreateClubModal";
import "./Homepage.css"; 
import UserProfileModal from "../common/UserProfileModal";

function Homepage() {
    const [clubs, setClubs] = useState([]); // State to hold the list of clubs stored in Firestore
    const [currentUser, setCurrentUser] = useState(null); // State to store the current user
    const [showCreateClubModal, setShowCreateClubModal] = useState(false); // State to control create club modal visibility
    const [userData, setUserData] = useState(null);
    const [showUserProfileModal, setShowUserProfileModal] = useState(false); // State to control user profile modal visibility
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
            } catch (error) {
                console.error("Error fetching clubs: ", error);
            }
        };

        fetchClubs(); // Call fetchClubs when component mounts or currentUser changes
    }, [currentUser]);

    // Function to handle showing the create club modal
    const viewCreateClubModal = () => {
        setMessage(null); // Reset the message when the modal is opened
        setShowCreateClubModal(true); // Show the modal when Create Club is clicked
    }

    // Function to handle closing the create club modal
    const closeCreateClubModal = () => {
        setShowCreateClubModal(false); // Close the modal
    }

      // Function to handle showing the user profile modal
      const viewUserProfileModal = () => {
        const docRef = doc(db, 'Users', currentUser.uid);
        if(!userData){
            getDoc(docRef)
            .then((snapshot) => {
                setUserData({
                    name: snapshot.get('name'),
                    email: snapshot.get('email')
                });
            })
            .catch(err => {
                console.log(err.message, err)
            });
        }

        // setMessage(null); // Reset the message when the modal is opened
        setShowUserProfileModal(true); // Show the modal when the profile button is clicked
    }

    // Function to handle closing the user profile modal
    const closeUserProfileModal = () => {
        setShowUserProfileModal(false); // Close the modal
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

    return (
        <div>
            <ProfileButton onClick={viewUserProfileModal} />
            <div className='header'>
                <h1>GatherRound</h1>
                <p>Let the games begin!</p>
                <button onClick={logOut}> Logout </button>
            </div>
            <div className='homepage-wrapper'>
                <div className='scrollable-list'>
                    {/* Scrollable list of club buttons */}
                    {clubs.map((club) => (
                         <Link key={club.id} to={`Clubs/${club.name}`} className='club-button'>{club.name}</Link>
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
                    <CreateButton onClick={viewCreateClubModal} />
                </div>
                <div className='create-club-modal'>
                    {/* Render the modal */}
                    <CreateClubModal show={showCreateClubModal} onClose={closeCreateClubModal} setMessage={handleSetMessage} currentUser={currentUser} />
                </div>
                <div className="user-profile-modal">
                    <UserProfileModal show={showUserProfileModal} onClose={closeUserProfileModal} logOut={logOut} userData={userData} />
                </div>
            </div>
        </div>
    );
}

export default Homepage;