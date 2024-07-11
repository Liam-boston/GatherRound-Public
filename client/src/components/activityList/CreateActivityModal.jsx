import React, { useState } from "react";
import "./CreateActivityModal.css";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase"

const CreateActivityModal = ({ show, onClose }) => {
    const [activityName, setActivityName] = useState("");
    const [activityDescription, setActivityDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "TestCollection"), {
                name: activityName,
                description: activityDescription,
                createdAt: new Date()
            });
            console.log("Document successfully created!")
            onClose(); // close the modal after successful submission
        } catch (error) {
            console.log("Error creating document: ", error);
        }
    }

    if (!show) {
        return null;
    }

    return (
        <div className='create-activity-modal__wrapper'>
            <div className='create-activity-modal__content'>
                <h2>Create a New Activity</h2>
                <form onSubmit={handleSubmit}>
                    <div className='create-activity-modal__input-box'>
                        <input id='activity-name' type='text' placeholder='Activity Name' value={activityName} onChange={(e) => setActivityName(e.target.value)} required />
                    </div>
                    <div className='create-activity-modal__input-box'>
                        <textarea id='activity-description' placeholder='Description' value={activityDescription} onChange={(e) => setActivityDescription(e.target.value)}></textarea>
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