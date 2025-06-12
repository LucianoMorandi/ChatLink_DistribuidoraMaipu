import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDNBwhFkb8Wtf3iiRQBHWbAdOS2iYl_AvM",
  authDomain: "catalogo-para-whatsapp.firebaseapp.com",
  projectId: "catalogo-para-whatsapp",
  storageBucket: "catalogo-para-whatsapp.firebasestorage.app",
  messagingSenderId: "733940234993",
  appId: "1:733940234993:web:914e125e4db962055dc750"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)