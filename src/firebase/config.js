import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBrsbeipqGU_gI1z_3woLsXbinMl_b8cZA",
  authDomain: "label-production-system.firebaseapp.com",
  projectId: "label-production-system",
  storageBucket: "label-production-system.firebasestorage.app",
  // storageBucket: "label-production-system.appspot.com",
  messagingSenderId: "992250303597",
  appId: "1:992250303597:web:0426b2857588cca8429b64",
  measurementId: "G-8CQ2FW8759",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
