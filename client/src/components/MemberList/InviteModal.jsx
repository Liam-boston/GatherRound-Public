import React, { useState } from "react";
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { v4 as uuidv4 } from 'uuid';
import "./InviteModal.css";

const InviteModal = ({ show, onClose, currentUser, clubId, clubName }) => {
    const [generatedLink, setGeneratedLink] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const handleGenerateInvite = async () => {
        try {
            // Generate a unique token for the invite using uuidv4
            const inviteToken = uuidv4();

            // Create the invite link
            const link = `${window.location.origin}/JoinClub?inviteToken=${inviteToken}&clubId=${clubId}&admin=${isAdmin}`;
            setGeneratedLink(link);

            // Store the invite token in Firestore
            await setDoc(doc(db, "Invitations", inviteToken), {
                clubId: clubId,
                createdAt: new Date(),
                used: false,
                admin: isAdmin,
                createdBy: currentUser.uid
            });
            console.log("Successfully generated invite link and added it to the Invitations collection.");
        } catch (error) {
            console.error("Error generating invite:", error);
            alert("Failed to generate invite.");
        }
    };

    const handleClose = () => {
        setGeneratedLink(""); // Clear the generated link
        setIsAdmin(false); // Uncheck the admin checkbox
        onClose(); // Call the onClose function to close the modal
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        alert("Invite link copied to clipboard!");
    };

    if (!show) {
        return null;
    }

    return (
        <div className='invite-modal__wrapper'>
            <div className='invite-modal__content'>
                <h2>Invite New Member</h2>
                {!generatedLink ? (
                    <>
                        <p className='invite-modal__instructions'>
                            Click "Generate Invite" to create a unique invite link for the {clubName} club.
                            Share this link with anyone you want to invite and they can use it
                            to sign up or log in and get added to the club!
                        </p>
                        <div className='invite-modal__admin-toggle'>
                            <input
                                type="checkbox"
                                id="admin"
                                checked={isAdmin}
                                onChange={() => setIsAdmin(!isAdmin)}
                            />
                            <label htmlFor="admin">Grant new member admin privileges?</label>
                        </div>
                        <div className='invite-modal__buttons'>
                            <button
                                data-testid="invite-modal__close"
                                className='invite-modal__cancel'
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                data-testid="invite-modal__generate"
                                className='invite-modal__submit'
                                onClick={handleGenerateInvite}
                            >
                                Generate Invite
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='invite-modal__link-box'>
                            <p className='invite-modal__link-text'>{generatedLink}</p>
                            <div className='invite-modal__link-box-buttons'>
                                <button
                                    data-testid="invite-modal__close"
                                    className='invite-modal__close'
                                    onClick={handleClose}
                                >
                                    Close
                                </button>
                                <button
                                    data-testid="invite-modal__copy"
                                    className='invite-modal__copy'
                                    onClick={handleCopyLink}
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InviteModal;
