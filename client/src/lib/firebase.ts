// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration (hardcoded version for testing)
const firebaseConfig = {
  apiKey: "AIzaSyDs7JK9_Y8W9Vm0R-Np4H1Dyi2kbAItN0A",
  authDomain: "kneeconnect-6ed2c.firebaseapp.com",
  projectId: "kneeconnect-6ed2c",
  storageBucket: "kneeconnect-6ed2c.firebasestorage.app",
  messagingSenderId: "686232836747",
  appId: "1:686232836747:web:7e15a53db69cf4db58d28e",
  measurementId: "G-H5BZ0W5PZ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional analytics (only run in browser)
if (typeof window !== "undefined") {
  getAnalytics(app);
}

export default app;
