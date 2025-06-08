
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyCOJQk-UO2faZ7EqZcrQM0HNaF0o3g4s1Q",
  authDomain: "crackoffcampus-65901.firebaseapp.com",
  projectId: "crackoffcampus-65901",
  storageBucket: "crackoffcampus-65901.firebasestorage.app",
  messagingSenderId: "649445507111",
  appId: "1:649445507111:web:4bf085547c78204f68ce02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
