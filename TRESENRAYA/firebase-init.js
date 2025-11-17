// Centralized Firebase initialization (modular SDK v10)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config (shared across TRESENRAYA pages)
const firebaseConfig = {
    apiKey: "AIzaSyDjSsmrOT7huC-HBZIiM3FkrjBBkw-TVGQ",
    authDomain: "proyecto-3-en-raya.firebaseapp.com",
    projectId: "proyecto-3-en-raya",
    storageBucket: "proyecto-3-en-raya.firebasestorage.app",
    messagingSenderId: "252069733137",
    appId: "1:252069733137:web:b8b96d435700e1c49962b0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Exponer en window para compatibilidad con código existente
window.app = app;
window.auth = auth;
window.db = db;

export { app, auth, db };
