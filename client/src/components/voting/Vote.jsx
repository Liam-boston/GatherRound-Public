import "./Vote.css";
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from "../../services/firebase"
import { signOut, getAuth } from 'firebase/auth';
import ProfileButton from "../common/ProfileButton/ProfileButton";
import UserProfileModal from "../common/UserProfileModal";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Vote() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null); // State to store the current user
    const [activities, setActivities] = useState([]); // State to hold the list of clubs stored in Firestore
    const [showUserProfileModal, setShowUserProfileModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const { state } = useLocation();
    const { meetingID, clubID } = state;
    const [votes, setVotes] = useState([]);
    

    // Fetch the current user from Firebase Auth
    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, []);

    // Fetch clubs from Firestore
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Clubs", clubID, "Meetings", meetingID, "Activities")); // Fetch the Activities collection
                const activitiesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setActivities(activitiesList); // Update state with fetched activities
            } catch (error) {
                console.error("Error fetching activities: ", error);
            }
        };

        fetchActivities(); // Call fetchActivities when component mounts or currentUser changes
    }, [currentUser]);

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

    const closeUserProfileModal = () => {
        setShowUserProfileModal(false);
    }

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(activities);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setActivities(items);
    }

    const logOut = () => {
        signOut(auth)
        return <Navigate to="/" />;
    }

    const submitVote = async () => {
        // Ensure there are at least 3 activities
        if (activities.length < 3) {
            alert("Please reorder and select at least 3 activities.");
            return;
        }

        // After a user has reordered the activities, the activities state should reflect the new order. 
        // You can simply slice the first 3 items from this array to get the top 3 choices.
        const topThreeChoices = activities.slice(0, 3).map(activity => activity.id);
        console.log(topThreeChoices);

        // Pre-process data
        const activityMap = new Map();
        activities.forEach(activity => activityMap.set(
            activity.id,
            {
                min: activity.minPlayers,
                max: activity.maxPlayers,
                selected: activity.selected,
                votes: activity.votes
            }
        ));

        // Tally votes
        const newActivities = activityMap;
        const decidedParticipants = [];
        for (let vote of votes) {
            let activity = newActivities.get(vote);
            if (activity.votes.length + 1 == activity.min) {
                activity = {
                    ...activity,
                    selected: true,
                    votes: activity.votes.push(currentUser.uid)
                };
                decidedParticipants = activity.votes;
                break;
            } else {
                activity = {
                    ...activity,
                    votes: activity.votes.push(currentUser.uid)
                };
            }
            newActivities.set(vote, activity);
        }

        // Remove if decided
        if (decidedParticipants.length > 0) {
            const cleanActivities = newActivities; //rename variable?
            for (const [id, activity] in cleanActivities) {
                let newVotes = activity.votes.filter((vote) => {
                    return !decidedParticipants.includes(vote);
                });
                let newActivity = {
                    ...activity,
                    votes: newVotes
                };
                newActivities.set(id, newActivity);
            }
        }

        // Update data
        for (const [id, activity] of newActivities) {
            await updateDoc(collection(db, "Clubs", clubID, "Meetings", meetingID, "Activities", id), {
                minPlayers: activity.min,
                maxPlayers: activity.max,
                selected: activity.selected,
                votes: activity.votes
            });
        }

        // Navigate back to ActivityList
        navigate(`/Homepage/Clubs/${clubID}/${meetingID}/ActivityList`);
    }

    return (
        <div>
            <ProfileButton onClick={viewUserProfileModal} />
            <div className="header">
                <h1>Activity Selection</h1>
                <p className="subtitle">Cast your votes!</p>
                <button onClick={(e) => navigate(-1)}> Back to Activity List </button>
            </div>

            {/* Wrapper container for instructions and activity list */}
            <div className="wrapper-container">
                <div className="activity-wrapper">

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <div
                                    className="droppable"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <div className="scrollable-list">
                                        {activities.map((activity, index) => (
                                            <Draggable key={activity.id} draggableId={activity.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="reorderable-voting-button"
                                                    >
                                                        {activity.name} | Min-Max: {activity.minPlayers}-
                                                        {activity.maxPlayers} | Description: {activity.description}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <div className="user-profile-modal">
                        <UserProfileModal
                            show={showUserProfileModal}
                            onClose={closeUserProfileModal}
                            logOut={logOut}
                            userData={userData}
                        />
                    </div>
                </div>
                <div className="instructions-wrapper">
                    <p className="instructions-title">
                        <u>Select Your Top 3 Activities</u>
                    </p>
                    <ul>
                        <li>
                            Drag and drop the activities to arrange them in your preferred order.
                        </li>
                        <li>
                            Place your top three activities at the top of the list.
                        </li>
                        <li>
                            Only your top three choices will be considered, so choose wisely!
                        </li>
                        <li>
                            Submit your choices to cast your vote!
                        </li>
                    </ul>
                    <div className="button-container">
                        <button className="submit-votes" onClick={submitVote}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Vote;