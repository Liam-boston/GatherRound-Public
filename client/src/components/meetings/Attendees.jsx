import React, { useState, useEffect } from "react";
import "./Attendees.css";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../services/firebase";

const Attendees = ({ clubID, meetingID, RSVPClicked }) => {
    const [attendees, setAttendees] = useState([]); // State to store the current user

    // Fetch attendees from Firestore
    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Clubs', clubID, "Meetings", meetingID, "Attendees")); 
                const attendeesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAttendees(attendeesList); // Update state with fetched clubs
                console.log(attendees, attendeesList);
            } catch (error) {
                console.error("Error fetching clubs: ", error);
            }
        };

        fetchAttendees(); 
    }, [RSVPClicked]);



    return (
        <div className='options-wrapper'>
            {/* Main wrapper for the attendees */}
            <div className='options-list'>
                {/* List of attendees*/}
                {attendees.map((attendee, index) => (
                    <button type="button" onClick={(e) => null} key={index}    className='options'>{attendee.name}</button>  
                ))}  
            </div>
        </div> 
    );
};

export default Attendees;
