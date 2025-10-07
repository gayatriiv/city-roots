// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEGrY5w8nh8vSqcIVFlBucJZBsw_m3_IA",
  authDomain: "city-roots.firebaseapp.com",
  projectId: "city-roots",
  storageBucket: "city-roots.firebasestorage.app",
  messagingSenderId: "11763980395",
  appId: "1:11763980395:web:5d3770f1d9eb20c517b92e",
  measurementId: "G-SSS7TGZZ4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Guard analytics usage for non-browser environments
try {
  if (typeof window !== 'undefined') {
    getAnalytics(app);
  }
} catch {}

export const auth = getAuth(app);
export { RecaptchaVerifier };


