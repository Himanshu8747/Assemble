// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXl9m_11fJCVVaeC8DJgVQ41zhAvnTGMk",
  authDomain: "assemble-4651c.firebaseapp.com",
  projectId: "assemble-4651c",
  storageBucket: "assemble-4651c.firebasestorage.app",
  messagingSenderId: "617302417432",
  appId: "1:617302417432:web:eda8dd97b7154c206a236d",
  measurementId: "G-S5LFCZCZJW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);