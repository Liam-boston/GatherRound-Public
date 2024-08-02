import React, { useState } from "react";
import "./CreateClubModal.css";
import { collection, addDoc, setDoc, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

const CreateClubModal = ({ show, onClose, setMessage, currentUser, onClubCreated }) => {
    const [clubName, setClubName] = useState(""); 
    const [clubDescription, setClubDescription] = useState(""); 

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (!currentUser) {
            setMessage({ type: "error", text: "You must be logged in to create a club." });
            return;
        }

        // Fetch the user data from the Users collection
        const userDocRef = doc(db, "Users", currentUser.uid);
        let userData;

        try {
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                userData = userDoc.data();
            } else {
                setMessage({ type: "error", text: "User data not found." });
                return;
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to fetch user data." });
            console.log("Error fetching user document: ", error);
            return;
        }

        // Prepare the club data
        const data = {
            name: clubName,
            description: clubDescription,
            createdAt: new Date() 
        };

        // Reference to the new club document
        const docRef = doc(db, "Clubs", clubName);

        try {
            // Create the new club document
            await setDoc(docRef, data);

            // Update the user's clubNames field
            await updateDoc(userDocRef, {
                clubNames: arrayUnion(clubName) 
            });

            // Add the current user to the Members subcollection of the new club
            await setDoc(doc(db, `Clubs/${clubName}/Members/${currentUser.uid}`), {
                id: currentUser.uid,
                name: userData.name, 
                email: userData.email,
                admin: true
            });

            setClubName("");
            setClubDescription("");
            setMessage({ type: "success", text: `Successfully created the ${clubName} club!` });
            onClubCreated(); // Notify parent to refresh
            onClose();
        } catch (error) {
            setMessage({ type: "error", text: `Failed to create ${clubName}, please try again.` });
            console.log("Error creating document: ", error);
        }
    };

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
                        <button data-testid="create-club-modal__cancel" className='create-club-modal__cancel' type='button' onClick={onClose}>Cancel</button>
                        <button data-testid="create-club-modal__submit" className='create-club-modal__submit' type='submit'>Create Club</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateClubModal;
