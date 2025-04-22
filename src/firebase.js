// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASD4IsA4OI1KG_6P9SXMlFhvxZ4a6FmsE",
  authDomain: "raji-7ce4c.firebaseapp.com",
  projectId: "raji-7ce4c",
  storageBucket: "raji-7ce4c.firebasestorage.app",
  messagingSenderId: "256925184428",
  appId: "1:256925184428:web:391cda3bf4b3d23894ca09",
  measurementId: "G-XYE1YE81TR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };