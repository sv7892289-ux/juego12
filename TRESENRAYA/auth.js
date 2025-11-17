// auth.js - Wrapper de autenticación que expone helpers en `window`
import { auth, db } from './firebase-init.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// Registra un usuario y crea documento en collection `players`
export async function handleRegistration(name, email, password) {
  if (!name || !email || !password) {
    return { success: false, message: 'Por favor completa todos los campos.' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'players', user.uid), {
      name: name,
      email: email,
      gamesPlayed: 0,
      gamesWon: 0,
      winPercentage: 0,
      createdAt: serverTimestamp()
    });

    return { success: true, message: 'Registro exitoso. ¡Bienvenido!' };
  } catch (error) {
    console.error('Error en registro (auth.js):', error);
    let msg = 'Error: ';
    if (error.code === 'auth/email-already-in-use') {
      msg += 'El correo ya está registrado.';
    } else if (error.code === 'auth/invalid-email') {
      msg += 'Correo inválido.';
    } else if (error.code === 'auth/weak-password') {
      msg += 'La contraseña debe tener al menos 6 caracteres.';
    } else {
      msg += error.message || String(error);
    }
    return { success: false, message: msg };
  }
}

// Inicia sesión con persistencia local
export async function handleLogin(email, password) {
  if (!email || !password) {
    return { success: false, message: 'Por favor completa todos los campos.' };
  }

  try {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true, message: 'Inicio de sesión exitoso.' };
  } catch (error) {
    console.error('Error en login (auth.js):', error);
    let msg = 'Error: ';
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      msg += 'Correo o contraseña incorrectos.';
    } else if (error.code === 'auth/invalid-email') {
      msg += 'Correo inválido.';
    } else {
      msg += error.message || String(error);
    }
    return { success: false, message: msg };
  }
}

// Exponer en window para que los scripts del HTML existentes funcionen
window.handleRegistration = handleRegistration;
window.handleLogin = handleLogin;
// auth.js - Manejo de autenticación con Firebase v10
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDh32MZ-3SN-HI-Yvc-TYwz6ZTSyO4eSa4",
    authDomain: "base-de-datos-67958.firebaseapp.com",
    projectId: "base-de-datos-67958",
    storageBucket: "base-de-datos-67958.appspot.com",
    messagingSenderId: "776970018825",
    appId: "1:776970018825:web:b8b96d435700e1c49962b0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Función para manejar el registro
async function handleRegistration(name, email, password) {
    try {
        // 1. Crear usuario en Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Guardar datos en Firestore
        await setDoc(doc(db, "players", user.uid), {
            name: name,
            email: email,
            gamesPlayed: 0,
            gamesWon: 0,
            winPercentage: 0,
            createdAt: serverTimestamp()
        });

        return {
            success: true,
            message: "✅ Registro exitoso. ¡Bienvenido!"
        };
    } catch (error) {
        console.error("Error en registro:", error);
        let errorMessage = "Error: ";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage += "El correo ya está registrado.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage += "Correo inválido.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage += "La contraseña debe tener al menos 6 caracteres.";
        } else {
            errorMessage += error.message;
        }
        return {
            success: false,
            message: errorMessage
        };
    }
}

// Función para manejar el inicio de sesión
async function handleLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return {
            success: true,
            message: "✅ Inicio de sesión exitoso",
            user: userCredential.user
        };
    } catch (error) {
        console.error("Error en login:", error);
        let errorMessage = "Error: ";
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            errorMessage += "Correo o contraseña incorrectos.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage += "Correo inválido.";
        } else {
            errorMessage += error.message;
        }
        return {
            success: false,
            message: errorMessage
        };
    }
}

// Función para cerrar sesión
async function handleLogout() {
    try {
        await auth.signOut();
        return {
            success: true,
            message: "Sesión cerrada exitosamente"
        };
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        return {
            success: false,
            message: "Error al cerrar sesión: " + error.message
        };
    }
}

// Exportar funciones
window.handleRegistration = handleRegistration;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.auth = auth;
window.db = db;