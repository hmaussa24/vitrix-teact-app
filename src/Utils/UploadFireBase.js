import firebase from 'firebase/compat/app';
//import 'firebase/compat/auth';
//import 'firebase/compat/firestore';
import 'firebase/compat/storage';
const firebaseConfig = {
    apiKey: "AIzaSyC0x-ZF9UCqvfsuMu93QBFjEhNcUJQgiRY",
    authDomain: "imagenes-a16a9.firebaseapp.com",
    projectId: "imagenes-a16a9",
    storageBucket: "imagenes-a16a9.appspot.com",
    messagingSenderId: "595996118920",
    appId: "1:595996118920:web:f5078ed8d74a67aa57b43d",
    measurementId: "G-NLXLKL0SMW"
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();


export { storage}