import "./Homepage.css"; 
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom"; 
import { signOut, getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from "../../services/firebase";
import ProfileButton from "../common/ProfileButton/ProfileButton";
import CreateButton from "../common/CreateButton/CreateButton"; 
import CreateClubModal from "./CreateClubModal";
import UserProfileModal from "../common/UserProfileModal";

function Homepage() {
    const [clubs, setClubs] = useState([]); 
    const [userClubs, setUserClubs] = useState([]); 
    const [currentUser, setCurrentUser] = useState(null); 
    const [showCreateClubModal, setShowCreateClubModal] = useState(false); 
    const [userData, setUserData] = useState(null);
    const [showUserProfileModal, setShowUserProfileModal] = useState(false); 
    const [message, setMessage] = useState(null); 
    const navigate = useNavigate();
    const location = useLocation();

    //Get current user
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    //Handles new user joining club
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const clubName = params.get("clubName");

        if (clubName) {
            setMessage({
                type: "success",
                text: `You've successfully joined ${clubName}!`
            });

            const newUrl = `${window.location.pathname}`;
            window.history.replaceState({}, document.title, newUrl);
        }
    }, [location]);

    const fetchClubsAndUserData = async () => {
        if (!currentUser) return;

        try {
            const userDocRef = doc(db, 'Users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();

            if (userData && userData.clubNames) {
                setUserClubs(userData.clubNames);
            }

            const querySnapshot = await getDocs(collection(db, 'Clubs'));
            const clubsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const filteredClubs = clubsList.filter(club => userClubs.includes(club.name));
            setClubs(filteredClubs);

        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchClubsAndUserData();
    }, [currentUser, userClubs]);

    const viewCreateClubModal = () => {
        setMessage(null);
        setShowCreateClubModal(true);
    }

    const closeCreateClubModal = () => {
        setShowCreateClubModal(false);
    }
    
    //Function to handle viewing the profile modal
    const viewUserProfileModal = () => {
        const docRef = doc(db, 'Users', currentUser.uid);
        if (!userData) {
            getDoc(docRef)
                .then((snapshot) => {
                    setUserData({
                        name: snapshot.get('name'),
                        email: snapshot.get('email')
                    });
                })
                .catch(err => {
                    console.log(err.message, err)
                });
        }

        setShowUserProfileModal(true);
    }
    //Function to handle closing the profile modal
    const closeUserProfileModal = () => {
        setShowUserProfileModal(false);
    }

    const logOut = () => {
        signOut(auth)
        return <Navigate to="/" />;
    }
    
    // Function to set the success or failure message
    const handleSetMessage = (newMessage) => {
        setMessage(newMessage);
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    };

    const handleClubCreation = () => {
        fetchClubsAndUserData();
    }

    return (
        <div>
            <ProfileButton onClick={viewUserProfileModal} />
            <div className='header'>
                <h1>GatherRound</h1>
                <p>Let the games begin!</p>
            </div>
            <div className='homepage-wrapper'>
                {/* Display message if userClubs is empty */}
                {currentUser && userClubs.length === 0 && (
                    <div className="empty-clubs-message">
                        <p>It looks like you don't belong to any clubs yet! Not to worry, you can create your own below or join an existing one with an invite link.</p>
                    </div>
                )}
                <div className='scrollable-list'>
                    {clubs.map((club) => (
                        <button type="button" onClick={(e) => navigate(`Clubs/${club.name}`)} key={club.id}  className='club-button'>{club.name}</button>
                    ))}
                </div>
                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
                <div>
                    <CreateButton onClick={viewCreateClubModal} />
                </div>
                <div className='create-club-modal'>
                    <CreateClubModal 
                        show={showCreateClubModal} 
                        onClose={closeCreateClubModal} 
                        setMessage={handleSetMessage} 
                        currentUser={currentUser} 
                        onClubCreated={handleClubCreation} // Pass down the handler
                    />
                </div>
            </div>
            <div className="user-profile-modal">
            <UserProfileModal show={showUserProfileModal} onClose={closeUserProfileModal} logOut={logOut} userData={userData} />
            </div>
        </div>
    );
}

export default Homepage;
