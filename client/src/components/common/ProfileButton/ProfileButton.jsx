import React from "react";
import { CgProfile } from "react-icons/cg";
import "./ProfileButton.css"; // Create a CSS file for styling if needed

const ProfileButton = ({ onClick }) => {
    return (
        <button className="profile-button" onClick={onClick} title="View profile" data-testid='profile-button'>
            <CgProfile size={28}/>
        </button>
    );
};

export default ProfileButton;
