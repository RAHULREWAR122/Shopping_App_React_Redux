// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABg_Ld9zIm7YGajEveItt0McfTaZO8J84",
  authDomain: "shopping-app-c8122.firebaseapp.com",
  projectId: "shopping-app-c8122",
  storageBucket: "shopping-app-c8122.appspot.com",
  messagingSenderId: "839385534663",
  appId: "1:839385534663:web:40b6975fba9a4c30d12ee2",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const db = getFirestore(app);

export { auth, db };
