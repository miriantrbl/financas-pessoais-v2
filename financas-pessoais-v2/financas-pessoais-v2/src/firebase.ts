import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBTZqMcW7GEvtLBII2KfNV-Xe4Bzd4xhVA",
  authDomain: "financas-pessoais-a39e0.firebaseapp.com",
  projectId: "financas-pessoais-a39e0",
  storageBucket: "financas-pessoais-a39e0.firebasestorage.app",
  messagingSenderId: "1021272594027",
  appId: "1:1021272594027:web:abf5026c10a6233b26832e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
