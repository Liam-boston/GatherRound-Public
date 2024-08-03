import './LoginSignup.css';
import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { db } from "../../services/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, getAuth, signOut } from 'firebase/auth';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const LoginSignup = () => {
    const [searchParams] = useSearchParams();
    const inviteToken = searchParams.get('inviteToken');
    const clubId = searchParams.get('clubId');
    const isAdmin = searchParams.get('admin') === 'true';

    // State to control the current action ('active' for signup, '' for login)
    // Set the initial action based on the presence of an invite
    const [action, setAction] = useState(inviteToken && clubId ? 'active' : '');

    // State to manage the name, email, and password inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State to manage password verification and error messages
    const [passwordVerification, setPasswordVerification] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordVerificationMessage, setPasswordVerificationMessage] = useState('');
    const [validSignup, setValidSignup] = useState(false);

    // Regex patterns for email and password validation
    const regExEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const regExPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

    const [greetingMessage, setGreetingMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [goToEmailVerification, setGoToEmailVerification] = useState(false);
    const navigate = useNavigate();
    const [goToHomepage, setGoToHomepage] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        setEmail('');
        setPassword('');
        setPasswordVerification('');
    }, [action]);

    useEffect(() => {
        if (inviteToken && clubId) {
            window.alert(`Welcome! Thank you for accepting an invitation to join the ${clubId} club! GatherRound is a place to connect and enjoy board games with others, create an account or sign in to join the fun!`);
        }
    }, [inviteToken, clubId]);

    // Handle Login form submission
    const login = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            // Use Firebase authentication to sign in with email and password
            const authUser = await signInWithEmailAndPassword(auth, email, password);

            if (authUser.user.emailVerified) {
                // Check if the user logged in using an invite link
                if (inviteToken && clubId) {
                    const userDocRef = doc(db, 'Users', authUser.user.uid);
                    const userDoc = await getDoc(userDocRef);
                    const userData = userDoc.data();

                    if (!userDoc.exists()) {
                        console.log('User document does not exist');
                        return;
                    }

                    // Initialize the clubNames array with the corresponding array in Firestore if it exists
                    const clubNames = userData.clubNames || [];

                    // Add the new club ID to the clubNames array if it's not already included
                    if (!clubNames.includes(clubId)) {
                        const updatedClubNames = [...clubNames, clubId];

                        // Update the user's clubNames field in Firestore
                        await setDoc(userDocRef, { clubNames: updatedClubNames }, { merge: true });
                    }

                    // Add user to the club's Members subcollection
                    const clubMemberDocRef = doc(db, `Clubs/${clubId}/Members`, authUser.user.uid);
                    const clubMemberDoc = await getDoc(clubMemberDocRef);

                    if (!clubMemberDoc.exists()) {
                        const inviteDoc = await getDoc(doc(db, `Invitations`, inviteToken));
                        // If the invite exists and hasn't been used yet
                        if (inviteDoc.exists() && !inviteDoc.data().used) {
                            const inviteData = inviteDoc.data();

                            await setDoc(clubMemberDocRef, {
                                id: authUser.user.uid,
                                name: userData.name,
                                email: email,
                                admin: isAdmin
                            });

                            // Update the 'used' field in the invitation
                            await setDoc(doc(db, `Invitations`, inviteToken), {
                                ...inviteData,
                                used: true
                            });

                            // Set success message
                            setSuccessMessage(`You've successfully joined the ${clubId} club!`);
                        } else {
                            console.log('Invalid invite token');
                        }
                    }
                }
                // Navigate to homepage after successful login and joining club
                setGoToHomepage(true);
            } else {
                console.log('Email not verified');
            }
        } catch (error) {
            console.log('Login error:', error);
        }
    };


    // Handle Signup form submission
    const signUp = async (e) => {
        e.preventDefault();
        if (validSignup) {
            try {
                // Create user with email and password
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Initialize the clubNames array with the inviting club name if available
                const initialClubNames = inviteToken && clubId ? [clubId] : [];

                // Add user to Firestore Users collection
                await setDoc(doc(db, 'Users', user.uid), {
                    id: user.uid,
                    name: name,
                    email: email,
                    clubNames: initialClubNames
                });

                // Check if the user signed up using an invite link
                if (inviteToken && clubId) {
                    const inviteDoc = await getDoc(doc(db, `Invitations`, inviteToken));
                    // If the invite exists and hasn't been used yet
                    if (inviteDoc.exists() && !inviteDoc.data().used) {
                        const inviteData = inviteDoc.data();

                        // Add user to the club's Members subcollection
                        await setDoc(doc(db, `Clubs/${clubId}/Members`, user.uid), {
                            id: user.uid,
                            name: name,
                            email: email,
                            admin: isAdmin
                        });

                        // Update the 'used' field in the invitation
                        await setDoc(doc(db, `Invitations`, inviteToken), {
                            ...inviteData,
                            used: true // Mark the invitation as used
                        });
                    } else {
                        console.log('Invalid invite token');
                    }
                }

                // Send email verification
                await sendEmailVerification(user);
                setGoToEmailVerification(true);

                // Sign out the user after registration
                await signOut(auth);
            } catch (error) {
                console.log('Sign up error:', error);
            }
        }
    };

    const signupSwitch = (e) => {
        e.preventDefault();
        setAction('active');
    }

    const loginSwitch = (e) => {
        e.preventDefault();
        setAction('');
    }

    useEffect(() => {
        if (!regExEmail.test(email) && email !== "") {
            setEmailErrorMessage("Email is Not Valid");
            setValidSignup(false);
        } else {
            setEmailErrorMessage("");
        }
    }, [email, regExEmail]);

    useEffect(() => {
        if (passwordVerification !== password && passwordVerification !== "") {
            setPasswordVerificationMessage("Passwords do not match");
            setValidSignup(false);
        } else {
            setPasswordVerificationMessage("");
        }
    }, [passwordVerification, password]);

    useEffect(() => {
        if (!regExPassword.test(password) && password !== "") {
            setPasswordErrorMessage("Password is Not Valid");
            setValidSignup(false);
        } else {
            setPasswordErrorMessage("");
        }
    }, [password, regExPassword]);

    useEffect(() => {
        if (regExEmail.test(email)
            && regExPassword.test(password)
            && passwordVerification !== ""
            && passwordVerification === password
        ) {
            setValidSignup(true);
        }
    }, [email, password, passwordVerification, regExEmail, regExPassword]);

    useEffect(() => {
        if (inviteToken && clubId) {
            setGreetingMessage(`Welcome! Thank you for accepting an invitation to join ${clubId}. GatherRound is a place to connect and enjoy board games with others, create an account or sign in to join the fun!`);
        } else {
            setGreetingMessage('');
        }
    }, [inviteToken, clubId]);

    if (goToEmailVerification) {
        return <Navigate to="/EmailVerification" />;
    }

    if (goToHomepage) {
        return <Navigate to={`/Homepage?successMessage=${encodeURIComponent(successMessage)}`} />;
    }

    return (
        <div className='login-signup-container'>
            <div className='header'>
                <h1>GatherRound</h1>
                <p>Let the games begin!</p>
            </div>
            <div className={`wrapper ${action}`}>
                {/* Login form */}
                <div className='form-box login' data-testid='login-el'>
                    <form onSubmit={login}>
                        <h1>Login</h1>
                        <div className='input-box'>
                            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} data-testid='login-email' required />
                            <FaEnvelope className='icon' />
                        </div>
                        <div className='input-box'>
                            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} data-testid='login-password' required />
                            <FaLock className='icon' />
                        </div>
                        <div className='forgot-password'>
                            <p><a href="">Forgot password?</a></p>
                        </div>
                        <button type="submit" data-testid='login-submit'>Login</button>
                        <div className='signup-option'>
                            <button className='sign-up' type="button" onClick={signupSwitch} data-testid='signup-switch'>Sign Up</button>
                        </div>
                    </form>
                </div>

                {/* Signup form */}
                <div className='form-box signup' data-testid='signup-el'>
                    <form onSubmit={signUp} data-testid='signup-form'>
                        <h1>Signup</h1>
                        <div className='input-box'>
                            <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} data-testid='signup-name' required />
                            <FaUser className='icon' />
                        </div>
                        <div className='input-box'>
                            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} data-testid='signup-email' required />
                            <FaEnvelope className='icon' />
                        </div>
                        <div className='input-box'>
                            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} data-testid='signup-password' required />
                            <FaLock className='icon' />
                        </div>
                        <div className='input-box'>
                            <input type="password" placeholder='Re-enter password' value={passwordVerification} onChange={(e) => setPasswordVerification(e.target.value)} data-testid='signup-password-verification' required />
                            <FaLock className='icon' />
                        </div>
                        <button type="submit" data-testid='signup-submit' disabled={!validSignup}>Sign Up</button>
                        <div className='cancel-option'>
                            <button className='cancel' type="button" onClick={loginSwitch}>Have an account already?</button>
                        </div>
                        <div className='temporary-outputs'>
                            <p data-testid='signup-email-error'>{emailErrorMessage}</p>
                            <p data-testid='signup-password-error'>{passwordErrorMessage}</p>
                            <p data-testid='signup-password-verification-message'>{passwordVerificationMessage}</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
