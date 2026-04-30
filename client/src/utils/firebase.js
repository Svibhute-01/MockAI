// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "mockai-bc070.firebaseapp.com",
  projectId: "mockai-bc070",
  storageBucket: "mockai-bc070.firebasestorage.app",
  messagingSenderId: "232893860599",
  appId: "1:232893860599:web:c34bf74fe9c6336cd061f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export {auth,provider};