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
        g01: {
            token: "9f3c2b8e7a6d4c1e0a9b5f8d3e2c7a1f4b6d9e0c2a8f7",
            message: `Papá, gracias por todo lo que me has enseñado estos años.
Tu paciencia, tu responsabilidad y tu forma de estar han sido una escuela para mí.
Eres un chingón, aunque sé que también sigues aprendiendo, como todos.
Hoy me siento listo para volar, incluso sabiendo que puedo caer.
Te quiero mucho y te deseo lo mejor este año.
Feliz.`
        },

        g02: {
            token: "c8a1f3e7b6d2a9e0c4f8d5b7e1a3c9f6d2a8b0e4f7c1",
            message: `Diego, Lax y Liam:
Les deseo un año lleno de amor, aprendizaje y crecimiento.
Gracias por confiar en mí como padrino; Liam es una alegría enorme.
Cuentan conmigo siempre y espero compartir muchos momentos más con él.
Feliz.`
        },

        g03: {
            token: "7e0f1c3a8d2b6f9e5a4c7b1d0f8e9a2c6b3d4f7e1",
            message: `Tía Elsa, gracias de corazón.
Desde siempre me hiciste sentir acompañado, incluso sin decir palabras.
Esa forma tuya de estar ha sido una luz tranquila en mi vida.
Nunca me has fallado y espero yo tampoco hacerlo contigo.
Cuenta conmigo siempre.
Feliz.`
        },

        g04: {
            token: "2a9c6e7f0b4d8f1e3c5a7d6b9e0f2a8c4",
            message: `Mariana, Iván, Vale y Juanpi:
Les deseo un año lleno de amor, salud y prosperidad.
Mariana, gracias por dar la mano cuando más importa; eso no se olvida.
Toda la familia cuenta conmigo.
No esperen el día perfecto: atrévanse a hacerlo.
Feliz.`
        },

        g05: {
            token: "f1c8a9e2b6d7a0f4e3c5b9d8a6e7f2c1",
            message: `Hola, tía Sonia.
Te deseo un 2026 con salud, tranquilidad y buenos momentos.
Cada día es una oportunidad distinta para ver la vida con más claridad.
Que este año lo vivas con calma.
Feliz.`
        },

        g06: {
            token: "6e4a2c9f7b1d8e0f5a3c6b9e2d7a8f1",
            message: `Ana, Luis y familia:
Les deseo un año lleno de amor, salud y prosperidad.
Que nunca olviden que el conocimiento abre puertas y el aprendizaje no se detiene.
Que sus metas sigan tomando forma.
Feliz.`
        },

        g07: {
            token: "0f3a9e7b6c2d4f1a8e5b9c7d6f2a1e4",
            message: `Tía Rosario y familia:
Les deseo un año próspero, lleno de experiencias y aprendizajes.
Que el trabajo no les quite lo más importante: vivir y compartir.
Mis mejores deseos para todos.
Feliz.`
        },

        g08: {
            token: "b2c9a6e7f0d4a1e8c3b5f9d7a2e6",
            message: `Tíos Óscar y Sandra, y familia:
A pesar de la distancia, su forma de vivir y construir siempre ha sido una referencia para mí.
Su constancia y claridad iluminan más de lo que imaginan.
Espero seguir aprendiendo de ustedes muchos años más.
Feliz.`
        },

        g09: {
            token: "8f7d1a6e2c9b5a0f3e4d7c8b1f9e6",
            message: `Alonso,
Te deseo lo mejor para ti y tu familia.
Admiro tu paciencia y tu constancia, incluso cuando el camino se alarga.
Que este año sigas creciendo a tu ritmo.
Feliz.`
        },

        g10: {
            token: "c4b8a9f0e2d7a1c6b3f5e9d8a7",
            message: `Mamá, aunque no siempre esté cerca, eso no cambia lo que siento.
Sé que no he sido el mejor hijo y soy consciente de ello.
La vida me llevó a construir desde otro lugar, pero tú sigues siendo parte de mi camino.
Te quiero y siempre cuentas conmigo.
Feliz.`
        },

        g11: {
            token: "1e7c9b5f2a8d6e0a4c3b9f7d1e",
            message: `Tío Lalo,
Gracias por esa energía que ilumina incluso los días pesados.
Tu presencia siempre suma y se nota.
Quiero que sepas que cuentas conmigo cuando lo necesites.
Feliz.`
        },

        g12: {
            token: "d0a7e9f1b6c8a2e5d4f3c9b7a",
            message: `Te deseo un año lleno de salud, fuerza y prosperidad.
Que sigas avanzando con carácter y claridad.
Feliz.`
        },

        g13: {
            token: "5f3b1a9e7d0c2f8a6b4e9d1c7",
            message: `Que esta luz acompañe tus días y te recuerde que siempre hay camino por delante.
Gracias por estar, por compartir y por ser parte de mi historia.
Feliz.`
        }
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
