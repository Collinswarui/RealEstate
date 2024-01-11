// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "wakoriestates.firebaseapp.com",
  projectId: "wakoriestates",
  storageBucket: "wakoriestates.appspot.com",
  messagingSenderId: "265582250035",
  appId: "1:265582250035:web:f9efa70688fbfc2e93fb46"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);