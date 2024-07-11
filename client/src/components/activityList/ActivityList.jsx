import "./ActivityList.css"; 
import React, {useState} from 'react';
//import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//import { collection, getDocs } from "firebase/firestore";
//import { db } from "../../services/firebase"
import CreateButton from "../common/CreateButton/CreateButton";
import CreateActivityModal from "./CreateActivityModal";


function ActivityList() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    // Temporary list of club names
    const tempActivityList = [
        'Risk',
        'DnD',
        'Monopoly',
        'Clue',
        'Chess'
    ];

    const viewModal = () => {
        setShowModal(true); // Show the modal when Create Club is clicked
    }

    const closeModal = () => {
        setShowModal(false); // Close the modal
    }

    return (
        <div>
            <div className='header'>
                <h1>Club Name</h1>
                <p>List of activities</p>
                <button onClick={(e) => navigate(-1)}> Back to Club Page </button>
            </div>
            <div className='activity-wrapper'>
                {/* Main wrapper for the ActivityList content */}
                <div className='scrollable-list'>
                    {/* Scrollable list of activities */}
                    {tempActivityList.map((activity, index) => (
                        <button key={index} className='activity-button'>{activity}</button>
                    ))}
                </div>
                <div className='create-activity'>
                    {/* Create an activity button */}
                    <CreateButton onClick={viewModal} />
                </div>
                <div className='create-activity-modal'>
                    {/* Render the modal */}
                    <CreateActivityModal show={showModal} onClose={closeModal} />
                </div>
            </div>
        </div>
    );
}

export default ActivityList;