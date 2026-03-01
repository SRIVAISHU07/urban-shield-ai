import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvIm2ahVvq4WIqtfzM8XJ7_kZ660ZHujE",
  authDomain: "urban-portal-d64f7.firebaseapp.com",
  projectId: "urban-portal-d64f7",
  storageBucket: "urban-portal-d64f7.firebasestorage.app",
  messagingSenderId: "966952868350",
  appId: "1:966952868350:web:cd730159d35f66bd7208af"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);