import React, { useState } from "react";
import "./CreateClubModal.css";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";

const CreateClubModal = ({ show, onClose, setMessage, currentUser }) => {
    const [clubName, setClubName] = useState(""); // State to store the club name
    const [clubDescription, setClubDescription] = useState(""); // State to store the club description

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // If the user is not logged in, show an error message and return
        if (!currentUser) {
            setMessage({ type: "error", text: "You must be logged in to create a club." });
            return;
        }

        // Prepare club data to be added to Firestore
        const data = {
            name: clubName,
            description: clubDescription,
            admin: [currentUser.uid], // Add the current user to the admin list
            members: [], // Initialize an empty members list
            createdAt: new Date() // Set the creation date
        };

        // Reference to the Firestore document
        const docRef = doc(db, "Clubs", clubName);

        try {
            // Set the document with the prepared data
            await setDoc(docRef, data);

            // Clear both input fields after successful creation
            setClubName("");
            setClubDescription("");

            // Set success message
            setMessage({ type: "success", text: `Successfully created ${clubName}!` });

            // Close the modal after successful creation
            onClose();
        } catch (error) {
            // Set failure message if there's an error
            setMessage({ type: "error", text: `Failed to create ${clubName}, please try again.` });
            console.log("Error creating document: ", error);
        }
    };

    // If the modal is not supposed to be shown, return null to render nothing
    if (!show) {
        return null;
    }

    // Render the modal content if 'show' prop is true
    return (
        <div className='create-club-modal__wrapper'>
            <div className='create-club-modal__content'>
                <h2>Create a New Club</h2>
                <form onSubmit={handleSubmit}>
                    <div className='create-club-modal__input-box'>
                        <input 
                            id='club-name' 
                            type='text' 
                            placeholder='Club Name' 
                            value={clubName} 
                            onChange={(e) => setClubName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className='create-club-modal__input-box'>
                        <textarea 
                            id='club-description' 
                            placeholder='Description' 
                            value={clubDescription} 
                            onChange={(e) => setClubDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className='create-club-modal__buttons'>
                        <button data-testid="create-club-modal__cancel" className='create-club-modal__cancel' type='button' onClick={onClose}>Cancel</button>
                        <button data-testid="create-club-modal__submit" className='create-club-modal__submit' type='submit'>Create Club</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateClubModal;
