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
        // Call the Vercel Function
        const res = await fetch(`/api/message?id=${id}&k=${token}`);

        if (res.status === 401) {
            throw new Error("Acceso no autorizado.");
        }

        if (!res.ok) {
            throw new Error('Error de conexión con el servidor.');
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// Mock Simulator
function mockFetch(id, token) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simple verify logic: valid if token is not empty and id exists
            if (!token || !id) {
                reject(new Error("Token inválido o faltante."));
                return;
            }

            // Simulate "Valid" vs "Invalid" based on some dummy logic
            // e.g. if token == 'bad' -> fail
            if (token === 'bad') {
                reject(new Error("Acceso no autorizado."));
                return;
            }

            resolve({
                authorized: true,
                message: "¡Hola! Este es tu mensaje secreto para el 2026. Espero que este año sea increíble para ti. Guarda este enlace, quizás cambie..."
            });
        }, 1500); // Simulate network latency
    });
}
