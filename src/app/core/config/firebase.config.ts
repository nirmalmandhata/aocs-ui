import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace with your Firebase config from Firebase Console
export const firebaseConfig = {
  apiKey: 'AIzaSyChRi8XIgo8ORU2NRV5R526cod0J4Lve3c',
  authDomain: 'aocs-3bd9f.firebaseapp.com',
  projectId: 'aocs-3bd9f',
  storageBucket: 'aocs-3bd9f.firebasestorage.app',
  messagingSenderId: '796198148579',
  appId: '1:796198148579:web:8826e55938715b4383a8d6',
  measurementId: "G-YD2X1YXS5K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
