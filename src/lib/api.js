/**
 * API Service
 * Handles communication with backend or uses mock data.
 */

const USE_MOCK = false; // Set to false to use real Backend (/api/message)

export async function fetchSecretMessage({ id, token }) {
    // DEV MODE CHECK
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isDevParam = new URLSearchParams(window.location.search).has('dev');

    // Si estamos en localhost o se fuerza con ?dev=1, usamos el Mock Dev
    if (isLocal || isDevParam) {
        console.log("DEV MODE: Returning mock data");
        return mockFetch(id, token, true); // Pass true to indicate dev mode text
    }

    if (USE_MOCK) {
        return mockFetch(id, token);
    }

    try {
        // Codificamos parámetros para evitar issues con caracteres especiales
        const safeId = encodeURIComponent(id);
        const safeToken = encodeURIComponent(token);

        // Call the Vercel Function
        const res = await fetch(`/api/message?id=${safeId}&k=${safeToken}`);

        // Si es 401 (o cualquier otro error no-ok), lanzamos error para que la vista muestre "No autorizado"
        if (!res.ok) {
            if (res.status === 401) throw new Error("Acceso no autorizado.");
            throw new Error(`Error del servidor: ${res.status}`);
        }

        const data = await res.json();

        // Doble check por seguridad
        if (!data.authorized) {
            throw new Error("Acceso no autorizado.");
        }

        return data;
    } catch (error) {
        console.warn("API Error:", error.message);
        throw error;
    }
}

// Mock Simulator (Legacy + Dev Mode)
function mockFetch(id, token, isDev = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!token || !id) return reject(new Error("Token inválido."));
            if (token === 'bad') return reject(new Error("No autorizado (Mock)."));

            const message = isDev
                ? "Modo Desarrollador Activado.\nEsta es una simulación de mensaje.\nSirve para probar la narrativa sin backend.\nDisfruta el diseño premium."
                : "MOCK: Mensaje secreto demo.";

            resolve({
                authorized: true,
                message: message
            });
        }, 1000);
    });
}

export async function checkManualAccess({ name, pin }) {


    try {
        const res = await fetch('/api/access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, pin })
        });
        return await res.json();
    } catch (e) {
        throw new Error("Error de conexión");
    }
}
