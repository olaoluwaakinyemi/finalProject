// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCDgA5uLYk2OKBDluzhXdB53dikUI4Ns8",
  authDomain: "taskfinal-6875d.firebaseapp.com",
  projectId: "taskfinal-6875d",
  storageBucket: "taskfinal-6875d.appspot.com",
  messagingSenderId: "770230754911",
  appId: "1:770230754911:web:5049fa9f0c66b8370405ea",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
