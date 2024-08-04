import "./ClubDetails.css"; 
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { signOut, getAuth } from 'firebase/auth';
import ProfileButton from "../common/ProfileButton/ProfileButton";
import CreateMeetingModal from "./CreateMeetingModal";
import CreateButton from "../common/CreateButton/CreateButton"; 
import { doc, getDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { auth, db } from "../../services/firebase";
import UserProfileModal from "../common/UserProfileModal";

function ClubDetails() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [currentUser, setCurrentUser] = useState(null); // State to store the current user
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [message, setMessage] = useState(null); // State to hold the success or failure message
    const [meetings, setMeetings] = useState([]); // State to hold the list of meetings stored in Firestore
    const [showUserProfileModal, setShowUserProfileModal] = useState(false); 
    const docRef1 = collection(db, "Clubs", id, "Meetings");
    const [userData, setUserData] = useState(null);

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

    // Fetch meetings from Firestore
    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const querySnapshot = await getDocs(query(docRef1, orderBy('createdAt'))); // Fetch the Meetings collection
                const meetingsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMeetings(meetingsList); // Update state with fetched meetings
                console.log(meetings, meetingsList)
            } catch (error) {
                console.error("Error fetching meetings: ", error);
            }
        };

        fetchMeetings(); // Call fetchMeetings when component mounts or currentUser changes
    }, [currentUser, showModal]);


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

    return (
            <div>
                 <ProfileButton onClick={viewUserProfileModal} />
                <div className='header'>
                    <h1>{id}</h1>
                </div>
                <div className='overall-wrapper'>
                    <div className='options-wrapper'>
                            {/* Main wrapper for the options */}
                            <div className='options-list'>
                                {/* List of options*/} 
                                    <button type="button" onClick={(e) => navigate("MemberList")}  className='options'>List of Members</button>  
                                    <button type="button" onClick={(e) => navigate("/Homepage")}  className='options'>Return Home</button>  
                                    <button type="button" onClick={(e) => null}  className='options'>Leave Club</button>  
                            </div>
                    </div>
                        <div className='activity-wrapper'>
                            {/* Main wrapper for the meeting messages */}
                            <div className='messages-list'>
                                {/* Scrollable list of meeting messages*/}
                                {meetings.map((meeting, index) => (
                                 <button type="button" onClick={(e) => navigate(`${meeting.name}`, { state: {clubID: id, currentUserID: currentUser.uid}})} key={index}  className='options'>{meeting.name}</button>  
                                ))}
                            </div>
                            {/* Display the success or failure message upon meeting creation */}
                             {message && (
                                <div className={`message ${message.type}`}>
                                    {message.text}
                                </div>
                             )}
                            <div className='create-club'>
                                {/* Create meeting button */}
                                <CreateButton onClick={viewModal} />
                            </div>
                            <div className='create-club-modal'>
                                {/* Render the modal */}
                                <CreateMeetingModal show={showModal} onClose={closeModal} setMessage={handleSetMessage} currentUser={currentUser} />
                            </div>
                    </div>
                    <div className="user-profile-modal">
                    <UserProfileModal show={showUserProfileModal} onClose={closeUserProfileModal} logOut={logOut} userData={userData} />
                    </div>
                </div>
            </div>
        );
}

export default ClubDetails;