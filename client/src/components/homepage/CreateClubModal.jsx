import React, { useState } from "react";
import "./CreateClubModal.css";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase"

const CreateClubModal = ({ show, onClose, setMessage, currentUser }) => {
    const [clubName, setClubName] = useState(""); // State to store the club name
    const [clubDescription, setClubDescription] = useState(""); // State to store the club description

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        // If the user is not logged in, show an error message
        if (!currentUser) {
            setMessage({ type: "error", text: "You must be logged in to create a club." });
            return;
        }

        const data = {
            name: clubName,
            description: clubDescription,
            admin: [currentUser.uid], // Add the current user to the admin list
            members: [], // Initialize an empty members list
            createdAt: new Date() // Set the creation date
        }
        const docRef = doc(db, "Clubs", clubName );
        // Add a new document to the Firestore collection
        

        try {

            await setDoc(docRef, data)
            // Clear both input fields
            setClubName("");
            setClubDescription("");

            // Set a success message
            setMessage({ type: "success", text: `Successfully created ${clubName}!` });

            // Close the modal
            console.log("Document successfully created!");
            onClose();
        } catch (error) {
            // Set a failure message
            setMessage({ type: "error", text: `Failed to create ${clubName}, please try again.` });
            console.log("Error creating document: ", error);
        }
    }

    // If the modal is not supposed to be shown, return null
    if (!show) {
        return null;
    }

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
                        <button className='create-club-modal__cancel' type='button' onClick={onClose}>Cancel</button>
                        <button className='create-club-modal__submit' type='submit'>Create Club</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateClubModal;
