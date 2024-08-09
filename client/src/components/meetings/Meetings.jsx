import "./Meetings.css"; 
import React, {useEffect, useState} from 'react';
import { Navigate, useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc} from "firebase/firestore";
import { db, auth} from "../../services/firebase"
import { signOut, getAuth } from 'firebase/auth';
import Attendees from "./Attendees";
import ProfileButton from "../common/ProfileButton/ProfileButton";
import UserProfileModal from "../common/UserProfileModal";


function Meetings() {

    const navigate = useNavigate();
    const {state} = useLocation();
    const [currentUser, setCurrentUser] = useState(null); // State to store the current user
    const [meeting, setMeeting] = useState({});
    const [member, setMember] = useState({});
    const [attendee, setAttendee] = useState();
    const [RSVPClicked, setRSVPClicked] = useState(null);
    const [showUserProfileModal, setShowUserProfileModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const { id } = useParams();
    const { clubID, currentUserID } = state;
    const meetingRef = doc(db, "Clubs", clubID, "Meetings", id);
    const userRef = doc(db, "Clubs", clubID, "Members", currentUserID);


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


    // Fetch current Meeting from Firestore
    const fetchMeeting = async () => {
        try {
            const tempData = await getDoc(meetingRef); // Fetch the Meeting
            setMeeting(tempData.data()); // Update state with fetched meeting
            console.log(meeting);
        } catch (error) {
            console.error("Error fetching meeting: ", error);
        }
    };

    useEffect(() => {
        fetchMeeting(); // Call fetchMeeting when component mounts or currentUser changes
    }, []);

    // Fetch current user from Firestore
    const fetchMember = async () => {
        try {
            const tempData = await getDoc(userRef); 
            setMember(tempData.data()); 
            console.log(member);
        } catch (error) {
            console.error("Error fetching current user: ", error);
        }
    };

    useEffect(() => {
        fetchMember(); 
    }, []);

    // Fetch attendee status from Firestore  
        const attendeeCheck = async () => {
            // Reference to the Firestore document
            const docRef4 = doc(db, "Clubs", clubID, "Meetings", id, "Attendees", currentUserID);
    
            try {
                const snapshot = await getDoc(docRef4); 
                if (snapshot.exists()){
                    setAttendee(true);
                }
            } catch (error) {
                console.log("Error attendeeCheck ", error);
            }
        };

    useEffect(() => {
        attendeeCheck(); 
    }, [RSVPClicked]);


    //Function to handle adding users to Attendees if they press the RSVP button
    const handleRSVPClick = async (e) => {
        e.preventDefault(); 
        const data = {
            name: member.name,
            email: member.email
        };

        // Reference to the Firestore document
        const docRef3 = doc(db, "Clubs", clubID, "Meetings", id, "Attendees", currentUserID);

        try {
            await setDoc(docRef3, data); 

        } catch (error) {
            console.log("Error RSVP ", error);
        }
        setRSVPClicked(true);
    }

    //Function to handle viewing the profile modal
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

    //Function to handle closing the profile modal
    const closeUserProfileModal = () => {
        setShowUserProfileModal(false);
    }

    const logOut = () => {
        signOut(auth)
        return <Navigate to="/" />;
    }


    return (
        <div>
             <ProfileButton onClick={viewUserProfileModal} />
            <div className='header'>
                <h1>{meeting.date}</h1>
                <div className='master-wrapper'>
                    <div className='overall-wrapper'>
                        <div className='options-wrapper'>
                                {/* Main wrapper for the options */}
                                <div className='options-list'>
                                    {/* List of options*/}
                                        <button type="button" disabled={!attendee} onClick={(e) => navigate("ActivityList", { state: {meetingID: id, clubID: clubID}})} className='options'>List of Activities</button>  
                                        <button type="button" disabled={!attendee} onClick={(e) => navigate("Vote", { state: {meetingID: id, clubID: clubID}})} className='options'>Vote</button>
                                        <button type="button" onClick={(e) => navigate(`/Homepage/Clubs/${clubID}`)}  className='options'>Return to Club</button>    
                                </div>
                        </div>
                        <div className='meetings-wrapper'>
                            {/* Main wrapper for the meeting messages */}
                            <div className='meetings-description'>    
                                <button type="button" onClick={(e) => null }  className='options'>{meeting.description}</button>
                            </div>
                        </div>
                        <Attendees RSVPClicked={RSVPClicked} clubID={clubID} meetingID={id}/> 
                    </div>  
                <button type="button" onClick={handleRSVPClick}  className='RSVP-button'>RSVP</button>
                </div>
            </div>
            <div className="user-profile-modal">
            <UserProfileModal show={showUserProfileModal} onClose={closeUserProfileModal} logOut={logOut} userData={userData} />
            </div>
        </div>
    );
    
}

export default Meetings

