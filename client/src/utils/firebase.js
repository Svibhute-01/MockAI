import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiqai-d2903.firebaseapp.com",
  projectId: "interviewiqai-d2903",
  storageBucket: "interviewiqai-d2903.firebasestorage.app",
  messagingSenderId: "977917881822",
  appId: "1:977917881822:web:e58eb37128af0e63ef814f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();