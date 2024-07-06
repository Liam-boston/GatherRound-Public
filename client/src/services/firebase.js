// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

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
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);