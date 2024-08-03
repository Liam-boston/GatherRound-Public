import React, { useState } from "react";
import "./CreateMeetingModal.css";
import { db } from "../../services/firebase";
import { collection, addDoc, setDoc, doc, Timestamp } from "firebase/firestore";
import { useParams } from 'react-router-dom';

const CreateMeetingModal = ({ show, onClose, setMessage, currentUser }) => {
    const [meetingName, setMeetingName] = useState(""); // State to store the meeting name
    const [meetingDate, setMeetingDate] = useState(""); // State to store the meeting date
    const [meetingDescription, setMeetingDescription] = useState(""); // State to store the meeting description
    const { id } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If the user is not logged in, show an error message
        if (!currentUser) {
            setMessage({ type: "error", text: "You must be logged in to create a club." });
            return;
        }

            // Prepare club data to be added to Firestore
            const data = {
                name: meetingName,
                description: meetingDescription,
                date: meetingDate,
                dateTest: Timestamp.fromDate(new Date(meetingDate)),
                creator: [currentUser.uid], // Add the current user to the creator list
                createdAt: new Date(), // Set the creation date  
            };
    
            // Reference to the Firestore document
            const docRef = doc(db, "Clubs", id, "Meetings", meetingName);

        try {
            // Add a new document to the Firestore collection
            await setDoc(docRef, data); 

            // Clear both input fields
            setMeetingName("");
            setMeetingDate("");
            setMeetingDescription("");

            // Set a success message
            setMessage({ type: "success", text: `Successfully created ${meetingName}!` });

            // Close the modal
            console.log("Document successfully created!");
            onClose();
        } catch (error) {
            // Set a failure message
            setMessage({ type: "error", text: `Failed to create ${meetingName}, please try again.` });
            console.log("Error creating document: ", error);
        }
    }

    // If the modal is not supposed to be shown, return null
    if (!show) {
        return null;
    }

    return (
        <div className='create-meeting-modal__wrapper' data-testid='create-meeting-modal'>
            <div className='create-meeting-modal__content'>
                <h2>Create a New Meeting</h2>
                <form onSubmit={handleSubmit}>
                    <div className='create-meeting-modal__input-box'>
                        <input 
                            id='meeting-name' 
                            type='text' 
                            placeholder='Meeting Name' 
                            value={meetingName} 
                            onChange={(e) => setMeetingName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className='create-activity-modal__input-box'>
                        <input 
                            id='meeting-date' 
                            type='text' 
                            placeholder='mm/dd/yyyy' 
                            value={meetingDate} 
                            onChange={(e) => setMeetingDate(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className='create-activity-modal__input-box'>
                        <textarea 
                            id='meeting-description' 
                            placeholder='Description' 
                            value={meetingDescription} 
                            onChange={(e) => setMeetingDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className='create-meeting-modal__buttons'>
                        <button 
                            className='create-meeting-modal__cancel' 
                            type='button' 
                            onClick={onClose}
                            data-testid='create-meeting-modal__cancel'
                        >
                            Cancel
                        </button>
                        <button 
                            className='create-meeting-modal__submit' 
                            type='submit'
                            data-testid='create-meeting-modal__submit'
                        >
                            Create Meeting
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMeetingModal;
