import "./Vote.css"; 
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../services/firebase"
import { signOut, getAuth } from 'firebase/auth';
import CreateButton from "../common/CreateButton/CreateButton";
import CreateActivityModal from "./CreateActivityModal";
import ProfileButton from "../common/ProfileButton/ProfileButton";
import UserProfileModal from "../common/UserProfileModal";



function Vote() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [currentUser, setCurrentUser] = useState(null); // State to store the current user
    const [message, setMessage] = useState(null); // State to hold the success or failure message
    const [activities, setActivities] = useState([]); // State to hold the list of clubs stored in Firestore
    const [showUserProfileModal, setShowUserProfileModal] = useState(false); 
    const [userData, setUserData] = useState(null);
    const {state} = useLocation();
    const { meetingID, clubID } = state;
    const [votes, setVotes] = userState([]);


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

    const viewUserProfileModal = () => {
        const docRef = doc(db, 'Users', currentUser.uid);
        if (!userData) {
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

        setShowUserProfileModal(true);
    }

    const closeUserProfileModal = () => {
        setShowUserProfileModal(false);
    }

    const logOut = () => {
        signOut(auth)
        return <Navigate to="/" />;
    }

    const submitVote = () => {
        // Pre-process data
        const activityMap = new Map();
        activitiesList.forEach(activity => activityMap.set(
            activity.id,
            {
                min: activity.minPlayers,
                max: activity.maxPlayers,
                selected: activity.selected,
                votes: activity.votes
            }
        ));

        // Tally votes
        const newActivities = activityMap;
        const decidedParticipants = [];
        for(let vote of votes){
            let activity = newActivities.get(vote);
            if(activity.votes.length + 1 == activity.min){
                activity = {
                    ...activity,
                    selected: true,
                    votes: activity.votes.push(currentUser.uid)
                };
                decidedParticipants = activity.votes;
                break;
            }else{
                activity = {
                    ...activity,
                    votes: activity.votes.push(currentUser.uid)
                };
            }
            newActivities.set(vote, activity);
        }

        // Remove if decided
        if(decidedParticipants.length > 0){
            const cleanActivities = newActivities; //rename variable?
            for(const [id, activity] in cleanActivities){
                let newVotes = activity.votes.filter((vote) => {
                    return !decidedParticipants.includes(vote);
                });
                let newActivity = {
                    ...activity,
                    votes: newVotes
                };
                newActivities.set(id, newActivity);
            }
        }

        // Prepare data to update
        
    }

    return (
        <div>
            <ProfileButton onClick={viewUserProfileModal} />
            <div className='header'>
                <h1>{meetingID}</h1>
                <p>List of activities</p>
                <button onClick={(e) => navigate(-1)}> Back to Meeting Page </button>
            </div>
            <div className='activity-wrapper'>
                <div className='scrollable-list'>
                    {/* Scrollable list of club buttons */}
                    {activities.map((activity, index) => (
                        <button onClick={(e) => null} key={index} className='club-button'>{activity.name} | Min-Max: {activity.minPlayers}-{activity.maxPlayers} | Description: {activity.description}</button>
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
                    {/* TODO: What's this about? */}
                    <CreateButton onClick={viewModal} />
                </div>
                <div className='create-club-modal'>
                    {/* Render the modal */}
                    <CreateActivityModal show={showModal} onClose={closeModal} setMessage={handleSetMessage} currentUser={currentUser} clubID={clubID} />
                </div>
                <div className="user-profile-modal">
                <UserProfileModal show={showUserProfileModal} onClose={closeUserProfileModal} logOut={logOut} userData={userData} />
                </div>
            </div>
        </div>
    );
}

export default Vote;