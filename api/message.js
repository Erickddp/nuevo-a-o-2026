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








    // Base de datos de regalos (15)
    const GIFTS = {
        g01: {
            token: "9f3c2b8e7a6d4c1e0a9b5f8d3e2c7a1f4b6d9e0c2a8f7",
            message: `Para Papá:
Gracias por todo lo que me has enseñado estos años.
Tu paciencia, tu responsabilidad y tu forma de estar
han sido una escuela para mí.
Los próximos años asegúrate de
disfrutar, vivir como quieres,
estar donde quieras.
Y ya es mi turno.
Te deseo feliz.`
        },

        g02: {
            token: "c8a1f3e7b6d2a9e0c4f8d5b7e1a3c9f6d2a8b0e4f7c1",
            message: `Para Diego y familia:
Les deseo un año lleno de salud, aprendizaje y crecimiento.
Que sean mejores vecinos, compadres y amigos.
Que Liam crezca y crezca.
Cuentan conmigo siempre
y espero compartir muchos momentos más.
Feliz.`
        },

        g03: {
            token: "7e0f1c3a8d2b6f9e5a4c7b1d0f8e9a2c6b3d4f7e1",
            message: `Para Tía Elsa:
Gracias de corazón.
Desde siempre me hiciste sentir acompañado,
incluso sin decir palabras.
Que los próximos años te traigan salud,
tranquilidad y buenos momentos.
Que sigas siendo la persona que eres.
Feliz.`
        },

        g04: {
            token: "2a9c6e7f0b4d8f1e3c5a7d6b9e0f2a8c4",
            message: `Para Mariana y familia:
Hemos sido y siempre seremos
una misma familia.
Gracias por estar estos años.
Les deseo un año lleno de salud y prosperidad.
Todos ustedes cuentan conmigo siempre
(soliciten mis horarios disponibles en mi agenda compartida).
Feliz.`
        },

        g05: {
            token: "f1c8a9e2b6d7a0f4e3c5b9d8a6e7f2c1",
            message: `Para Tía Sonia:
Por todos esos buenos momentos
y los malos,
pero cuando estabas presente,
todo era más fácil.
Hoy en adelante quiero que sepas
que cuentas conmigo cuando lo necesites.
Mucha salud, prosperidad y felicidad.
Que este y los años siguientes los vivas con calma.
Feliz.`
        },

        g06: {
            token: "6e4a2c9f7b1d8e0f5a3c6b9e2d7a8f1",
            message: `Para Ana y familia:
Les deseo un año lleno de amor, salud y prosperidad.
Que sus metas sigan tomando forma.
Feliz.`
        },

        g07: {
            token: "0f3a9e7b6c2d4f1a8e5b9c7d6f2a1e4",
            message: `Para Tía Chayo y familia:
Les deseo un año próspero, lleno de experiencias y aprendizajes.
Que el trabajo no les quite lo más importante: vivir y compartir.
Mis mejores deseos para todos.
Feliz.`
        },

        g08: {
            token: "b2c9a6e7f0d4a1e8c3b5f9d7a2e6",
            message: `Para Tíos Óscar y Sandra, y familia:
Cuando se trata de agradecer,
las palabras no alcanzan.
Toda mi vida, tío, tía,
han aportado de manera positiva en mi vida,
sin importar si lo hacen conscientemente:
una rutina, un ejemplo o un consejo.
Todos ellos los tomo con emoción.
Espero seguir aprendiendo de ustedes muchos años más.
Les deseo mucha salud y prosperidad,
no solo el próximo año, sino todos los siguientes.
Feliz.`
        },

        g09: {
            token: "8f7d1a6e2c9b5a0f3e4d7c8b1f9e6",
            message: `Para Alonso:
Te deseo lo mejor para ti y tu familia.
Admiro tu paciencia y tu constancia.
Todo a su tiempo,
pero otras veces no:
es solo trakas hdspm.
Mucho éxito en todo lo que hagas.
Salud y prosperidad para ti y tu familia.
Feliz.`
        },

        g10: {
            token: "c4b8a9f0e2d7a1c6b3f5e9d8a7",
            message: `Para Lalo y familia:
Que esta luz acompañe tus días
y te recuerde que siempre hay camino por delante.
Gracias por estar, por compartir
y por ser parte de mi 2025.
Feliz.`
        },

        g11: {
            token: "1e7c9b5f2a8d6e0a4c3b9f7d1e",
            message: `Para Mamá:
Aunque no siempre esté cerca, eso no cambia lo que siento.
Sé que no he sido el mejor hijo y soy consciente de ello.
La vida me llevó a construir desde otro lugar,
pero tú sigues siendo parte de mi camino.
Te quiero y siempre cuentas conmigo.
Feliz.`
        },

        g12: {
            token: "d0a7e9f1b6c8a2e5d4f3c9b7a",
            message: `Para Tío Lalo:
Gracias por esa energía que ilumina incluso los días pesados.
Tu presencia siempre suma y se nota.
Quiero que sepas que cuentas conmigo cuando lo necesites.
Feliz.`
        },

        g13: {
            token: "5f3b1a9e7d0c2f8a6b4e9d1c7",
            message: `Para Daniel:
Te deseo un año lleno de salud, fuerza y prosperidad.
Que sigas avanzando con carácter y claridad.
Feliz.`
        },

        // Tokens nuevos (generados)
        g14: {
            token: "a3f1c9e7d4b2a8f0c6e1d9b7a5c3f8e2d0b6a9c1e7f3d8a2b5c0e6d1f9a7",
            message: `Para Armando:
Que esta luz acompañe tus días
y te recuerde que siempre hay camino por delante.
Gracias por estar, por compartir
y por ser parte de mi historia.
Feliz.`
        },

        g15: {
            token: "b6d0f2a9c4e7f1d3a8b5c2e9f0d7a6c1e8b3d9f4a0c5e2b7d1f8a3c6e9",
            message: `Para ti:
Este mensaje queda abierto
por si olvidé a alguien importante.
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
