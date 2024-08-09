import "./ActivityList.css";
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import { signOut, getAuth } from "firebase/auth";
import CreateButton from "../common/CreateButton/CreateButton";
import CreateActivityModal from "./CreateActivityModal";
import ProfileButton from "../common/ProfileButton/ProfileButton";
import UserProfileModal from "../common/UserProfileModal";

function ActivityList() {
  console.log('activities');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [currentUser, setCurrentUser] = useState(null); // State to store the current user
  const [message, setMessage] = useState(null); // State to hold the success or failure message
  const [activities, setActivities] = useState([]); // State to hold the list of clubs stored in Firestore
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const { state } = useLocation();
  const { meetingID, clubID } = state;


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
        const querySnapshot = await getDocs(
          collection(db, "Clubs", clubID, "Meetings", meetingID, "Activities")
        ); // Fetch the Activities collection
        const activitiesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActivities(activitiesList); // Update state with fetched activities
      } catch (error) {
        console.error("Error fetching activities: ", error);
      }
    };

    fetchActivities(); // Call fetchActivities when component mounts or currentUser changes
  }, [currentUser]);

  // Get attendees
  useEffect(() => {
    const getMembers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'Clubs', clubID, "Meetings", meetingID, "Attendees")); 
            const attendeesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAttendees(attendeesList); // Update state with fetched clubs
        } catch (error) {
            console.error("Error fetching clubs: ", error);
        }
    };

    getMembers(); 
    console.log(attendees)
}, []);

  // Function to handle showing the modal
  const viewModal = () => {
    setMessage(null); // Reset the message when the modal is opened
    setShowModal(true); // Show the modal when Create Club is clicked
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setShowModal(false); // Close the modal
  };

  // Function to set the success or failure message
  const handleSetMessage = (newMessage) => {
    setMessage(newMessage);
    setTimeout(() => {
      setMessage(null);
    }, 3000); // Hide the message after 3 seconds
  };

  const viewUserProfileModal = () => {
    const docRef = doc(db, "Users", currentUser.uid);
    if (!userData) {
      getDoc(docRef)
        .then((snapshot) => {
          setUserData({
            name: snapshot.get("name"),
            email: snapshot.get("email"),
          });
        })
        .catch((err) => {
          console.log(err.message, err);
        });
    }

    setShowUserProfileModal(true);
  };

  const closeUserProfileModal = () => {
    setShowUserProfileModal(false);
  };

  const logOut = () => {
    signOut(auth);
    return <Navigate to="/" />;
  };

  // Function to navigate to the Vote page
  const handleVoteClick = () => {
    navigate(`/Homepage/Clubs/${clubID}/${meetingID}/Vote`, {
      state: { meetingID, clubID }
    });
  };

  // Funciton to navigate to the Meeting page
  const handleMeetingClick = () => {
    const currentUserID = currentUser.uid;
    navigate(`/Homepage/Clubs/${clubID}/${meetingID}/`, {
      state: { clubID, currentUserID }
    });
  };

  return (
    <div className="activity-list-container1">
      <ProfileButton onClick={viewUserProfileModal} />
      <div className="header">
        <h1>{meetingID}</h1>
        <p>List of activities</p>
        <button onClick={handleMeetingClick}> Back to Meeting Page </button>
      </div>

      {/* Wrapper container for activity list and voting instructions */}
      <div className="wrapper-container1">
        <div className="activity-list-wrapper1">
          <div className="scrollable-activity-list1">
            {activities.map((activity, index) => (
              <button onClick={null} key={index} className="activity-button1">
                <div className="activity-details1">
                  <div className="activity-name-container1">
                    <div className="activity-name1">{activity.name}</div>
                    <div className="activity-status1">
                      Status:
                      <span className={`is-selected ${activity.selected ? 'active' : 'is-not-selected'}`}>
                        {activity.selected ? ' Selected' : ' Not Selected'}
                      </span>
                    </div>
                  </div>
                  <div className="activity-information1">
                    Players: {activity.minPlayers === activity.maxPlayers ? activity.minPlayers : `${activity.minPlayers}-${activity.maxPlayers}`}
                  </div>
                  <div className="activity-description1">
                    {activity.description}
                  </div>
                  <div className="activity-participants" hidden={!activity.selected}>
                    Participants: {activity.selected ? 
                    activity.votes.map(vote => {
                      return attendees.find(attendee => attendee.id === vote).name;
                    }).join(", ") : ""}        
                  </div>
                </div>
              </button>
            ))}
          </div>
          {message && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
          <div className="create-activity">
            <CreateButton onClick={viewModal} />
          </div>
          <div className="create-activity-modal">
            <CreateActivityModal show={showModal} onClose={closeModal} setMessage={handleSetMessage} currentUser={currentUser} clubID={clubID} />
          </div>
        </div>
        <div className="voting-instructions">
          <p className="voting-instructions-title"><u>Proceed to vote?</u></p>
          <ul>
            <li>Check out the games being brought to the meeting in the list to the left.</li>
            <li>If you want to offer a game of your own you can add it to the list with the Create (+) button.</li>
            <li>When you're ready, click the 'Vote' button below to choose which activities you want to play!</li>
          </ul>
          <button className="vote-button" onClick={handleVoteClick}>Vote</button>
        </div>

      </div>
      <div className="user-profile-modal">
        <UserProfileModal
          show={showUserProfileModal}
          onClose={closeUserProfileModal}
          logOut={logOut}
          userData={userData}
        />
      </div>
    </div>
  );
}

export default ActivityList;
