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
        "g01": { token: "TOKEN_01", message: "MESSAGE_01" },
        "g02": { token: "TOKEN_02", message: "MESSAGE_02" },
        "g03": { token: "TOKEN_03", message: "MESSAGE_03" },
        "g04": { token: "TOKEN_04", message: "MESSAGE_04" },
        "g05": { token: "TOKEN_05", message: "MESSAGE_05" },
        "g06": { token: "TOKEN_06", message: "MESSAGE_06" },
        "g07": { token: "TOKEN_07", message: "MESSAGE_07" },
        "g08": { token: "TOKEN_08", message: "MESSAGE_08" },
        "g09": { token: "TOKEN_09", message: "MESSAGE_09" },
        "g10": { token: "TOKEN_10", message: "MESSAGE_10" },
        "g11": { token: "TOKEN_11", message: "MESSAGE_11" },
        "g12": { token: "TOKEN_12", message: "MESSAGE_12" },
        "g13": { token: "TOKEN_13", message: "MESSAGE_13" }
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
