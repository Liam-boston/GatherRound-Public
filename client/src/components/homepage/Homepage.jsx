import "./Homepage.css"; 
import React, { useState} from 'react';
import CreateButton from "../common/CreateButton/CreateButton"; 
import { signOut } from 'firebase/auth';
import { auth } from "../../services/firebase"
import { useNavigate } from "react-router-dom"; 
import { Navigate } from 'react-router-dom';


function Homepage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    

    const [goToClub, setGoToClub] = useState(false);

    // Temporary list of club names
    const tempClubList = [
        'The Catan Conquerors',
        'DnD Dragonslayers',
        'Risk Rulers',
        'Clue Sleuths',
        'Chess Champions'
    ];


    if (goToClub){
        return <Navigate to ="Clubs"/>;
    }

    const logOut = () => {
         signOut(auth)
         return <Navigate to="/"/>;
    }

    return (
        <div>
            <div className='header'>
                <h1>GatherRound</h1>
                <p>Let the games begin!</p>
                <button onClick={logOut}> Logout </button>
            </div>
            <div className='homepage-wrapper'>
                {/* Main wrapper for the homepage content */}
                <div className='scrollable-list'>
                    {/* Scrollable list of club buttons */}
                    {tempClubList.map((club, index) => (
                        <button onClick={(e) => setGoToClub(true)} key={index} className='club-button'>{club}
                        </button>
                        // Mapping through tempClubList to create club buttons
                    ))}
                </div>
                <div className='create-club'>
                    {/* Create club button */}
                    <CreateButton onClick={null} />
                    {/* Placeholder onClick handler */}
                </div>
            </div>
        </div>
    );
}

export default Homepage;