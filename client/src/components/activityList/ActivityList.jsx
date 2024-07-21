import "./ActivityList.css"; 
import React, { useState, useEffect } from "react";
//import { Navigate } from 'react-router-dom';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase"
import { getAuth } from 'firebase/auth';
import CreateButton from "../common/CreateButton/CreateButton";
import CreateActivityModal from "./CreateActivityModal";
import ProfileButton from "../common/ProfileButton/ProfileButton";



function ActivityList() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [currentUser, setCurrentUser] = useState(null); // State to store the current user
    const [message, setMessage] = useState(null); // State to hold the success or failure message
    const [activities, setActivities] = useState([]); // State to hold the list of clubs stored in Firestore
    const {state} = useLocation();
    const { meetingID, clubID } = state;


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
            const fetchActivities = async () => {
                try {
                    const querySnapshot = await getDocs(collection(db, "Clubs", clubID, "Meetings", meetingID, "Activities")); // Fetch the Activities collection
                    const activitiesList = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setActivities(activitiesList); // Update state with fetched activities
                } catch (error) {
                    console.error("Error fetching activities: ", error);
                }
            };
    
            fetchActivities(); // Call fetchActivities when component mounts or currentUser changes
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

    // Function to set the success or failure message
    const handleSetMessage = (newMessage) => {
        setMessage(newMessage);
        setTimeout(() => {
            setMessage(null);
        }, 3000); // Hide the message after 3 seconds
    };

    // Function to handle profile button click
    const handleProfileClick = () => {
        // TODO: Implement profile button click logic
    };

    return (
        <div>
            <ProfileButton onClick={handleProfileClick} />
            <div className='header'>
                <h1>Club Name</h1>
                <p>List of activities</p>
                <button onClick={(e) => navigate(-1)}> Back to Club Page </button>
            </div>
            <div className='activity-wrapper'>
                <div className='scrollable-list'>
                    {/* Scrollable list of club buttons */}
                    {activities.map((activity, index) => (
                        <button onClick={(e) => null} key={index} className='club-button'>{activity.name}
                        </button>
                        // Mapping through tempClubList to create club buttons
                    ))}
                </div>
                {/* Display the success or failure message upon club creation */}
                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
                <div className='create-club'>
                    {/* Create club button */}
                    <CreateButton onClick={viewModal} />
                </div>
                <div className='create-club-modal'>
                    {/* Render the modal */}
                    <CreateActivityModal show={showModal} onClose={closeModal} setMessage={handleSetMessage} currentUser={currentUser} clubID={clubID} />
                </div>
            </div>
        </div>
    );
}

export default ActivityList;