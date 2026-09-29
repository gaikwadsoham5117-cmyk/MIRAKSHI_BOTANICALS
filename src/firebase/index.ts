import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDpAdwTJEvIuriusz6XKZK8PVnV_bqYg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "oilwebsite-a9a32.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "oilwebsite-a9a32",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "oilwebsite-a9a32.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "847462533912",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:847462533912:web:5cfc288abc122cf0fd2c6d"
};

export const FIREBASE_VAPID_KEY = 
  import.meta.env.VITE_FIREBASE_VAPID_KEY || 
  "BC0MikujuEka0u0czPaF98iR-jWZYYd6frBE-puN4Pk07O_52m9LhPZauOfWYEw9BiWoGZWlcIJ4ftn1saK8oTs";

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
