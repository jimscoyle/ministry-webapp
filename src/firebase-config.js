// src/firebase-config.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXPwRpMewU6F5QdH3jwYHtyZYudmt63Os",
  authDomain: "pit-app-1dad2.firebaseapp.com",
  projectId: "pit-app-1dad2",
  storageBucket: "pit-app-1dad2.firebasestorage.app",
  messagingSenderId: "507477118022",
  appId: "1:507477118022:web:476e5387d1604897df0e47",
  measurementId: "G-QSSF4V819C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Export Firebase Auth and Firestore
export const auth = getAuth(app);  // Export auth
export const db = getFirestore(app);  // Export Firestore db