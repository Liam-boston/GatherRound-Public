import "./MemberList.css"; 
import React, {useState, useEffect} from 'react';
//import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase"
import ProfileButton from "../common/ProfileButton/ProfileButton";


function MemberList() {

    const navigate = useNavigate();
    const [member, setMember] = useState([]);
    
    useEffect(()=>{
        const fetchMembers = async () => {
       
            await getDocs(collection(db, "Users"))
                .then((querySnapshot)=>{               
                    const newData = querySnapshot.docs
                        .map((doc) => ({...doc.data(), id:doc.id }));
                    setMember(newData);                
                    console.log(member, newData);
                })
           
        }
        
        fetchMembers();
    }, [])

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
                    {member.map((member, index) => (
                        <button onClick={(e) => null} key={index} className='member-button'>Name: {member.name} | Email: {member.email}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
    
}


export default MemberList