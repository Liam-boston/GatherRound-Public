import React, { useState } from "react";
import "./CreateActivityModal.css";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase"

const CreateActivityModal = ({ show, onClose, setMessage, currentUser }) => {
    const [activityName, setActivityName] = useState(""); // State to store the club name
    const [activityDescription, setActivityDescription] = useState(""); // State to store the club description

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        // If the user is not logged in, show an error message
        if (!currentUser) {
            setMessage({ type: "error", text: "You must be logged in to create a club." });
            return;
        }

        try {
            // Add a new document to the Firestore collection
            await addDoc(collection(db, "Activities"), {
                name: activityName,
                description: activityDescription,
                creator: [currentUser.uid], // Add the current user to the creator list
                voters: [], // Initialize an empty voters list
                createdAt: new Date() // Set the creation date
            });

            // Clear both input fields
            setActivityName("");
            setActivityDescription("");

            // Set a success message
            setMessage({ type: "success", text: `Successfully created ${activityName}!` });

            // Close the modal
            console.log("Document successfully created!");
            onClose();
        } catch (error) {
            // Set a failure message
            setMessage({ type: "error", text: `Failed to create ${activityName}, please try again.` });
            console.log("Error creating document: ", error);
        }
    }

    // If the modal is not supposed to be shown, return null
    if (!show) {
        return null;
    }

    return (
        <div className='create-activity-modal__wrapper'>
            <div className='create-activity-modal__content'>
                <h2>Create a New Activity</h2>
                <form onSubmit={handleSubmit}>
                    <div className='create-activity-modal__input-box'>
                        <input 
                            id='club-name' 
                            type='text' 
                            placeholder='Activity Name' 
                            value={activityName} 
                            onChange={(e) => setActivityName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className='create-activity-modal__input-box'>
                        <textarea 
                            id='activity-description' 
                            placeholder='Description' 
                            value={activityDescription} 
                            onChange={(e) => setActivityDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className='create-activity-modal__buttons'>
                        <button className='create-activity-modal__cancel' type='button' onClick={onClose}>Cancel</button>
                        <button className='create-activity-modal__submit' type='submit'>Create Activity</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateActivityModal;
