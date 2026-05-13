// Importamos las herramientas desde la web directamente (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tu configuración (la que me pasaste)
const firebaseConfig = {
  apiKey: "AIzaSyDh00rOP1ci1Vu9D1abZZDkLFvweOlwpU8",
  authDomain: "lalhia-9bdcd.firebaseapp.com",
  projectId: "lalhia-9bdcd",
  storageBucket: "lalhia-9bdcd.firebasestorage.app",
  messagingSenderId: "522451845203",
  appId: "1:522451845203:web:fe871a850a3a023fb506a6",
  measurementId: "G-GJ6QYJ1JBY"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Exportamos las herramientas para usarlas en el Login, Registro y Notas
export const auth = getAuth(app);
export const db = getFirestore(app);