import "./Meetings.css"; 
import React, {useEffect, useState} from 'react';
//import { Navigate } from 'react-router-dom';
//import { useNavigate } from 'react-router-dom';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase"
import { getAuth } from 'firebase/auth';
import ProfileButton from "../common/ProfileButton/ProfileButton";


function Meetings() {

    const navigate = useNavigate();
    const {state} = useLocation();
    const [currentUser, setCurrentUser] = useState(null); // State to store the current user
    const [meeting, setMeeting] = useState({});
    const { id } = useParams();
    const { clubID } = state;
    const docRef = doc(db, "Clubs", clubID, "Meetings", id);


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
        const fetchMeeting = async () => {
            try {
                const tempData = await getDoc(docRef); // Fetch the Meeting
                setMeeting(tempData.data()); // Update state with fetched meeting
                console.log(meeting);
            } catch (error) {
                console.error("Error fetching meeting: ", error);
            }
        };

        fetchMeeting(); // Call fetchMeeting when component mounts or currentUser changes
    }, [currentUser]);


    // Function to handle profile button click
    const handleProfileClick = () => {
        // TODO: Implement profile button click logic
    };

    return (
        <div>
             <ProfileButton onClick={handleProfileClick} />
            <div className='header'>
                <h1>{meeting.date}</h1>
                <div className='master-wrapper'>
                    <div className='overall-wrapper'>
                        <div className='options-wrapper'>
                                {/* Main wrapper for the options */}
                                <div className='options-list'>
                                    {/* List of options*/}
                                        <button type="button" onClick={(e) => navigate("ActivityList", { state: {meetingID: id, clubID: clubID}})}  className='options'>List of Activities</button>  
                                        <button type="button" onClick={(e) => navigate(-1)}  className='options'>Return to Club</button>    
                                </div>
                        </div>
                        <div className='activity-wrapper'>
                            {/* Main wrapper for the meeting messages */}
                            <div className='messages-list'>    
                                <button type="button" onClick={(e) => null }  className='options'>{meeting.description}</button>
                            </div>
                        </div>
                        <div className='options-wrapper'>
                                {/* Main wrapper for the attendees */}
                                <div className='options-list'>
                                    {/* List of attendees*/}
                                        <button type="button" onClick={(e) => null }  className='options'>Attendees 1</button>  
                                        <button type="button" onClick={(e) => null }  className='options'>Attendee 2</button>    
                                </div>
                        </div>
                    </div> 
                    <button type="button" onClick={(e) => null }  className='RSVP-button'>RSVP</button> 
                </div>
            </div>
        </div>
    );
    
}

export default Meetings

