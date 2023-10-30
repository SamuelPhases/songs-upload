// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCCXXtddCosZJHCOiMOge5KV60ZAaFR5E0",
//   authDomain: "songs-1ada6.firebaseapp.com",
//   projectId: "songs-1ada6",
//   storageBucket: "songs-1ada6.appspot.com",
//   messagingSenderId: "333777963104",
//   appId: "1:333777963104:web:a2ffbd434bae077bf55b05",
//   measurementId: "G-1VPPYKN6QJ"
// };
const firebaseConfig = {
  apiKey: "AIzaSyA5Xczy_3D00mQIajC5JNS1uLxFLohMH0c",
  authDomain: "songs-app-55255.firebaseapp.com",
  projectId: "songs-app-55255",
  storageBucket: "songs-app-55255.appspot.com",
  messagingSenderId: "501110904786",
  appId: "1:501110904786:web:0187c0a7482783f4285a0b",
  measurementId: "G-BQCJJXSLQ4"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);


if (!firebase.app.length) {
  firebase.initializeApp(firebaseConfig);
}