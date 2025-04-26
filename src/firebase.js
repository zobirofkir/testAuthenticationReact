import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAdWp3RML-v1LeS5lxh-AojyuaC0MB4cRg",
  authDomain: "livex-d2a85.firebaseapp.com",
  projectId: "livex-d2a85",
  storageBucket: "livex-d2a85.firebasestorage.app",
  messagingSenderId: "1006240598901",
  appId: "1:1006240598901:web:1c1eb4f0febe40ed38e13c",
  measurementId: "G-9EF70VRYF5"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();