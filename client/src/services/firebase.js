// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTi7yO6DwSXEyu5vCzQDJmO7joRqgtgkM",
  authDomain: "gatherround-ae0c4.firebaseapp.com",
  projectId: "gatherround-ae0c4",
  storageBucket: "gatherround-ae0c4.appspot.com",
  messagingSenderId: "878400732984",
  appId: "1:878400732984:web:fb8d9d4bf998a05adf4bcd",
  measurementId: "G-R8LF1J4XP1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth & Firestore
const db = getFirestore(app);
const auth = getAuth(app);

// NOTE: Firebase Local Emulator is all set-up and configured for use, I believe you just need to uncomment
// these lines and it will work. I set it up while testing the Homepage but eventually figured out how to Mock
// Firebase and pursued that instead. - Liam

// Connect Firestore emulator during testing
// if (process.env.NODE_ENV === 'test') {
//   connectFirestoreEmulator(db, process.env.FIRESTORE_EMULATOR_HOST);
// }

// Export Auth & Firestore
export { db, auth };
