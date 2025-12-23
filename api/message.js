export default function handler(req, res) {
    // 1. Configurar Headers (CORS opcional, Cache control)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // 2. Solo permitir GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 3. Extraer parámetros (Vercel parsea query string automáticamente)
    const { id, k } = req.query;

    // 4. "DB" en memoria (Placeholders editables)
    // CLAVE: ID del regalo (ej: '1', 'g01', 'novio')
    // VALOR: { token: 'SECRETO', message: 'TEXTO' }
    const GIFTS = {
        '1': { token: 'TKN_DEMO_01', message: '¡Hola! Este es el mensaje real del servidor para el Regalo #1.' },
        'g02': { token: 'ABC_123', message: 'Mensaje especial para g02. El futuro es brillante.' },
        'mvp': { token: 'supersecret', message: 'Mensaje exclusivo VIP. ¡Feliz 2026!' }
        // Agregar más aquí...
    };

    try {
        // 5. Validación
        // a) ¿Existe el ID?
        const gift = GIFTS[id];

        // b) ¿Existe regalo y el token coincide exactamente?
        // Nota: En producción real, usar timingSafeEqual para evitar timing attacks si fuera crítico.
        if (gift && gift.token === k) {
            return res.status(200).json({
                authorized: true,
                message: gift.message
            });
        }

        // 6. Fallo de autorización (Token incorrecto o ID no existe)
        // Retardamos un poco la respuesta para mitigar fuerza bruta (simulado)
        // await new Promise(r => setTimeout(r, 200)); 

        return res.status(401).json({
            authorized: false
        });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
