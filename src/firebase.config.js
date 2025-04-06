
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { FaUserLargeSlash } from "react-icons/fa6";

const firebaseConfig = {
  apiKey: "AIzaSyB0bFZkAHIi4E1HmGsdQICd3ZFc-B90e4g",
  authDomain: "chatting-app-2332c.firebaseapp.com",
  projectId: "chatting-app-2332c",
  storageBucket: "chatting-app-2332c.firebasestorage.app",
  messagingSenderId: "428719819199",
  appId: "1:428719819199:web:d7ecc2dd4979e39c95b90a",
  measurementId: "G-R707KJK5W6"
};


const app = initializeApp(firebaseConfig);


export default app