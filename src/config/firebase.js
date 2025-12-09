import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA8TUNQamImO8pYOGfRTeu9BOlta0bFlwI",
    authDomain: "fencingconsultancy.firebaseapp.com",
    projectId: "fencingconsultancy",
    storageBucket: "fencingconsultancy.firebasestorage.app",
    messagingSenderId: "432450850316",
    appId: "1:432450850316:web:eb5fa63de026fb5c016829"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
