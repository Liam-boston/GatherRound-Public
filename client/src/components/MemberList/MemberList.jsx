import "./MemberList.css"; 
import React, {useState, useEffect} from 'react';
//import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase"
import { auth } from "../../services/firebase"
import { getAuth } from 'firebase/auth';
import ProfileButton from "../common/ProfileButton/ProfileButton";


function MemberList() {

    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null); // State to store the current user
    const [member, setMember] = useState([]);
    const { id } = useParams();
    const docRef  = doc(db, "Clubs", id);

    
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

    // Fecth the members array form the current Club
    useEffect(()=>{
        const fetchMembers = async () => {
            try {
                await getDoc(docRef).then((docSnap)=> {
                    const tempData = docSnap.get("members")
                    setMember(tempData)
                    console.log(member, tempData);
                }) 
            } catch(error) {
                console.log(error)
            }    
        }
        fetchMembers();
    }, [currentUser])


    // Function to handle profile button click
    const handleProfileClick = () => {
        // TODO: Implement profile button click logic
    };


    return (
        <div>
             <ProfileButton onClick={handleProfileClick} />
            <div className='header'>
                <h1>Club Name</h1>
                <p>List of members</p>
                <button onClick={(e) => navigate(-1)}> Back to Club Page </button>
            </div>
            <div className='member-list-wrapper'>
                {/* Main wrapper for the MemberList content */}
                <div className='scrollable-list'>
                    {/* Scrollable list of members */}
                    {member.map((members, index) => (
                        <button onClick={(e) => null} key={index} className='member-button'>Name: {members}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
    
}



export default MemberList

