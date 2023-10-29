// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_YGO40ewA-5Ox3DtLhmMs7JmogOfO_b0",
  authDomain: "react-pokemon-app-62bc9.firebaseapp.com",
  projectId: "react-pokemon-app-62bc9",
  storageBucket: "react-pokemon-app-62bc9.appspot.com",
  messagingSenderId: "355713387418",
  appId: "1:355713387418:web:cff64d52e0ae608aa48823"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app