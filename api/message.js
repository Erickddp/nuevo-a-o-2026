export default function handler(req, res) {
    // Headers de seguridad y caché
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Solo permitir GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Extraer parámetros
    const { id, k } = req.query;

    // Validación básica de entrada
    if (!id || !k) {
        return res.status(401).json({ authorized: false });
    }

    // Base de datos de regalos (13 placeholders)
    const GIFTS = {
        g01: { token: "9f3c2b8e7a6d4c1e0a9b5f8d3e2c7a1f4b6d9e0c2a8f7", message: "mensajes" },
        g02: { token: "c8a1f3e7b6d2a9e0c4f8d5b7e1a3c9f6d2a8b0e4f7c1", message: "MESSAGE_02" },
        g03: { token: "7e0f1c3a8d2b6f9e5a4c7b1d0f8e9a2c6b3d4f7e1", message: "MESSAGE_03" },
        g04: { token: "2a9c6e7f0b4d8f1e3c5a7d6b9e0f2a8c4", message: "MESSAGE_04" },
        g05: { token: "f1c8a9e2b6d7a0f4e3c5b9d8a6e7f2c1", message: "MESSAGE_05" },
        g06: { token: "6e4a2c9f7b1d8e0f5a3c6b9e2d7a8f1", message: "MESSAGE_06" },
        g07: { token: "0f3a9e7b6c2d4f1a8e5b9c7d6f2a1e4", message: "MESSAGE_07" },
        g08: { token: "b2c9a6e7f0d4a1e8c3b5f9d7a2e6", message: "MESSAGE_08" },
        g09: { token: "8f7d1a6e2c9b5a0f3e4d7c8b1f9e6", message: "MESSAGE_09" },
        g10: { token: "c4b8a9f0e2d7a1c6b3f5e9d8a7", message: "MESSAGE_10" },
        g11: { token: "1e7c9b5f2a8d6e0a4c3b9f7d1e", message: "MESSAGE_11" },
        g12: { token: "d0a7e9f1b6c8a2e5d4f3c9b7a", message: "MESSAGE_12" },
        g13: { token: "5f3b1a9e7d0c2f8a6b4e9d1c7", message: "MESSAGE_13" }
    };

    try {
        const gift = GIFTS[id];

        // Validación estricta: existe el ID y el token coincide exactamente
        if (gift && gift.token === k) {
            return res.status(200).json({
                authorized: true,
                message: gift.message
            });
        }

        // Si falla cualquier validación
        return res.status(401).json({
            authorized: false
        });

    } catch (error) {
        // Error interno (no exponemos detalles sensibles)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
