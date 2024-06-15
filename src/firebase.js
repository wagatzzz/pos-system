// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcqynqF4cYnv4lAQr4o-tuhfEuL_hg6Tc",
  authDomain: "pos-system-2ca41.firebaseapp.com",
  projectId: "pos-system-2ca41",
  storageBucket: "pos-system-2ca41.appspot.com",
  messagingSenderId: "797794194407",
  appId: "1:797794194407:web:2d96cda0f0e2a029dae342"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);