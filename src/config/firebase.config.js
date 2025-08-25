// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCDHkqNuE_Yqb5sd2PZrMa686D7lkMJkr0",
  authDomain: "iron-helper-456216-b3.firebaseapp.com",
  projectId: "iron-helper-456216-b3",
  storageBucket: "iron-helper-456216-b3.firebasestorage.app",
  messagingSenderId: "990732452955",
  appId: "1:990732452955:web:a0ed08d954ba73b197ab7e",
  measurementId: "G-6NGZXDQKHM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;