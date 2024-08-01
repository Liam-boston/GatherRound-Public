import "./MemberList.css";
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
// import InviteModal from "../MemberList/InviteModal";
import { db } from "../../services/firebase";

function MemberList() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null); // State to store the current user
    const [member, setMember] = useState([]); // Initialize with an empty array
    const [showModal, setShowModal] = useState(false); // State to control the modal visibility
    const [isAdmin, setIsAdmin] = useState(false); // State to check if the current user is an admin
    const [message, setMessage] = useState(null); // State to manage messages
    const [clubName, setClubName] = useState(''); // State to store the club name
    const { id } = useParams();
    const docRef = doc(db, "Clubs", id);

    // Fetch the current user from Firebase Auth
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
                checkAdminStatus(user.uid);
            } else {
                setCurrentUser(null);
            }
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, []);

    // Check if the current user is an admin
    const checkAdminStatus = async (userId) => {
        try {
            const memberDocRef = doc(db, "Clubs", id, "Members", userId);
            const memberDoc = await getDoc(memberDocRef);
            if (memberDoc.exists()) {
                setIsAdmin(memberDoc.data().admin);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch the members array from the current Club and the club name
    useEffect(() => {
        const fetchClubData = async () => {
            try {
                const clubDoc = await getDoc(docRef);
                if (clubDoc.exists()) {
                    setClubName(clubDoc.data().name);

                    const membersCollection = collection(db, "Clubs", id, "Members");
                    const membersSnapshot = await getDocs(membersCollection);
                    const membersList = membersSnapshot.docs.map(doc => doc.data());

                    // Sort members: admins first
                    // true values (admin) are sorted/displayed before falsey values (non-admin)
                    const sortedMembers = membersList.sort((a, b) => b.admin - a.admin);
                    setMember(sortedMembers);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchClubData();
    }, [docRef, id]);

    const handleSetMessage = (message) => {
        setMessage(message);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <div className='header'>
                <h1>{clubName}</h1>
                <p>Members</p>
                <button onClick={() => navigate(-1)}>Back to Club Page</button>
            </div>
            <div className='member-list-wrapper'>
                <div className='scrollable-list'>
                    {member.length > 0 ? (
                        member.map((member, index) => (
                            <button onClick={() => null} key={index} className='member-button'>
                                {member.name} {member.admin ? "(admin)" : ""}
                            </button>
                        ))
                    ) : (
                        <p>No members found.</p>
                    )}
                </div>
                {/* <div className="tooltip-wrapper">
                    <button 
                        className={`invite-button ${!isAdmin ? 'disabled' : ''}`} 
                        onClick={isAdmin ? openModal : null} 
                        disabled={!isAdmin}
                    >
                        Invite Members
                    </button>
                    {!isAdmin && (
                        <span className="tooltip-text">Must be club admin to invite new members.</span>
                    )}
                </div>
                <div className="invite-modal">
                    <InviteModal show={showModal} onClose={closeModal} setMessage={handleSetMessage} currentUser={currentUser} clubId={id} isAdmin={isAdmin} />
                </div> */}
            </div>
        </div>
    );
}

export default MemberList;