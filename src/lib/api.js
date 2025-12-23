/**
 * API Service
 * Handles communication with backend or uses mock data.
 */

const USE_MOCK = false; // Set to false to use real Backend (/api/message)

export async function fetchSecretMessage({ id, token }) {
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

// Mock Simulator (Legacy)
function mockFetch(id, token) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!token || !id) return reject(new Error("Token inválido."));
            if (token === 'bad') return reject(new Error("No autorizado."));
            resolve({
                authorized: true,
                message: "MOCK: Mensaje secreto demo."
            });
        }, 1000);
    });
}
