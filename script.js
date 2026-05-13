import { auth, db } from './firebase-config.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- 1. CONTROL DE RUTAS Y SESIÓN ---
onAuthStateChanged(auth, (user) => {
    const path = window.location.pathname;
    const isLoginOrIndex = path.includes('login.html') || path.includes('index.html') || path.endsWith('/');

    if (!user) {
        // SI NO HAY USUARIO EN FIREBASE: Limpiar y mandar al login
        localStorage.clear();
        if (!isLoginOrIndex) {
            window.location.replace("login.html");
        }
    } 
    else {
        // SI HAY USUARIO: Verificar que tengamos su nombre en LocalStorage
        // Si por alguna razón no está, intentamos recuperarlo del perfil de Firebase
        if (!localStorage.getItem('usuarioActual')) {
            const nombreExtraido = user.displayName || "Amor";
            localStorage.setItem('usuarioActual', nombreExtraido);
        }

        // Redirigir al dashboard si está en el login/index
        if (isLoginOrIndex) {
            window.location.replace("dashboard.html");
        }
        
        cargarDatosInterfaz(user);
    }
});

function cargarDatosInterfaz(user) {
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (!usuarioActual) return;

    // 1.1 Saludo Dinámico (Día/Tarde/Noche)
    const greeting = document.getElementById('greeting');
    if (greeting) {
        const hour = new Date().getHours();
        let saludoBase = hour < 12 ? "¡BUEN DÍA" : hour < 19 ? "¡BUENAS TARDE" : "¡BUENAS NOCHE";
        let emoji = hour < 12 ? "☀️" : hour < 19 ? "☁️" : "🌙";

        greeting.innerText = `${saludoBase}S, ${usuarioActual.toUpperCase()}! ${emoji}`;
    }

    // 1.2 Foto de Perfil Dinámica
    const profileImg = document.getElementById('user-profile-img') || document.getElementById('player-photo');
    if (profileImg) {
        // Buscamos las imágenes según el nombre guardado
        if (usuarioActual.toLowerCase().includes('lalo')) {
            profileImg.src = "lalito_perfil.png";
        } else if (usuarioActual.toLowerCase().includes('mahia')) {
            profileImg.src = "mahia_perfil.png";
        }
    }
}

// --- 2. LÓGICA DE SALIDA (LOGOUT) ---
document.addEventListener('click', (e) => {
    if (e.target.closest('#btnLogout')) {
        e.preventDefault();
        signOut(auth).then(() => {
            localStorage.clear();
            window.location.replace("login.html");
        }).catch(err => console.error("Error al salir:", err));
    }
});

// --- 3. ENVIAR NOTAS (CON PROTECCIÓN) ---
document.addEventListener('click', async (e) => {
    if (e.target.id === 'btnPublicar') {
        const textoArea = document.getElementById('textoNota');
        const autor = localStorage.getItem('usuarioActual') || "Anónimo";
        
        if (textoArea && textoArea.value.trim()) {
            const originalBtnText = e.target.innerText;
            e.target.innerText = "Enviando...";
            e.target.disabled = true;

            try {
                await addDoc(collection(db, "notas"), {
                    texto: textoArea.value.trim(), 
                    autor: autor,
                    fecha: serverTimestamp()
                });
                
                textoArea.value = "";
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '¡Publicado!',
                        text: 'Tu notita ha sido guardada ✨',
                        icon: 'success',
                        confirmButtonColor: '#ff85a2'
                    });
                }
            } catch (error) {
                console.error("Error al publicar nota:", error);
                alert("No se pudo guardar la nota. Revisa tu conexión.");
            } finally {
                e.target.innerText = originalBtnText;
                e.target.disabled = false;
            }
        }
    }
});