import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDn_eaOL3FB9sZP2dZBRHfwXYLdhvtyyCM",
  authDomain: "testauthentication-73254.firebaseapp.com",
  projectId: "testauthentication-73254",
  storageBucket: "testauthentication-73254.firebasestorage.app",
  messagingSenderId: "814402843395",
  appId: "1:814402843395:web:2b8bfe475a530ec82eaf36",
  measurementId: "G-42JK5YRXDR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();