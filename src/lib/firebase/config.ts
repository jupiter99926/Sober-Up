import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from "firebase/analytics"; // Import isSupported

// Use environment variables defined in .env or deployment environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = getAuth(app);

// Initialize Analytics conditionally only on the client-side and if supported
let analytics = null;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
            console.log("Firebase Analytics initialized.");
        } else {
            console.log("Firebase Analytics is not supported in this environment.");
        }
    });
}


// Log config during build/server start for verification (optional, remove in production)
// console.log("Firebase Config Loaded:", {
//     apiKey: firebaseConfig.apiKey ? 'Loaded' : 'MISSING',
//     authDomain: firebaseConfig.authDomain,
//     projectId: firebaseConfig.projectId,
// });

export { app, auth, analytics }; // Export analytics
