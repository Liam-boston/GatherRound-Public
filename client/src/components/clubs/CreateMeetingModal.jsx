import React, { useState } from "react";
import "./CreateMeetingModal.css";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

const CreateMeetingModal = ({ show, onClose, setMessage, currentUser }) => {
    const [meetingName, setMeetingName] = useState(""); // State to store the club name
    const [meetingDescription, setMeetingDescription] = useState(""); // State to store the club description

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If the user is not logged in, show an error message
        if (!currentUser) {
            setMessage({ type: "error", text: "You must be logged in to create a club." });
            return;
        }

        try {
            // Add a new document to the Firestore collection
            await addDoc(collection(db, "Meetings"), {
                name: meetingName,
                description: meetingDescription,
                creator: [currentUser.uid], // Add the current user to the creator list
                createdAt: new Date(), // Set the creation date
                attendees: [], // Initialize empty list of attendees
                activities: [] // Initialize empty list of activities        
            });

            // Clear both input fields
            setMeetingName("");
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
                    <div className='create-meeting-modal__input-box'>
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
