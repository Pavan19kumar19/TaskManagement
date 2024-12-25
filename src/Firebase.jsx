// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };
const firebaseConfig = {
  apiKey: "AIzaSyAf3jrYcgA1tO9eYglF1vqAKTkIp8CcCpE",
  authDomain: "task-manager-ceb17.firebaseapp.com",
  // databaseURL: "https://task-manager-ceb17-default-rtdb.firebaseio.com",
  projectId: "task-manager-ceb17",
  storageBucket: "task-manager-ceb17.firebasestorage.app",
  messagingSenderId: "537045108098",
  appId: "1:537045108098:web:c4b47974d529780749bb9b",
  // measurementId: "G-VPBHXB4Q2H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
