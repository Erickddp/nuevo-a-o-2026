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

















































    const GIFTS = {

        g01: {
            token: "9f3c2b8e7a6d4c1e0a9b5f8d3e2c7a1f4b6d9e0c2a8f7",
            message: `Para Papá:
A veces no hace falta decir mucho
para aprender lo importante.

Tu forma de estar, de cumplir
y de seguir adelante
me ha enseñado más de lo que imaginas.

Ojalá este tiempo se sienta más tranquilo,
más a tu ritmo.
¿Te estás dando chance de disfrutarlo?

Yo sigo avanzando,
y mucho de eso viene de ti.

Siempre estaré`
        },

        g02: {
            token: "c8a1f3e7b6d2a9e0c4f8d5b7e1a3c9f6d2a8b0e4f7c1",
            message: `Para Diego y familia:
Qué gusto seguir compartiendo el camino.

Que estos días se sientan tranquilos,
con salud y momentos buenos en familia.
Liam va creciendo rodeado de lo mejor,
y eso se nota.

Sabes que cuentan conmigo,
para lo cotidiano y para lo que se vaya armando.
¿Cómo va arrancando todo por allá?

Siempre estaré`
        },

        g03: {
            token: "7e0f1c3a8d2b6f9e5a4c7b1d0f8e9a2c6b3d4f7e1",
            message: `Para Tía Elsa:
Solo quería decirte gracias,
así, sencillo.

Tu manera de cuidar
y de estar presente
siempre se siente.

Ojalá estos días vengan con calma,
con salud
y con momentos que se disfruten sin prisa.
¿Cómo te has sentido últimamente?

Siempre estaré`
        },

        g04: {
            token: "2a9c6e7f0b4d8f1e3c5a7d6b9e0f2a8c4",
            message: `Para Mariana y familia:
Hay personas que siempre están,
y eso no se olvida.

Gracias por seguir cerca,
por acompañar
y por compartir tanto.

Que estos días se sientan estables,
ligeros
y con buenas noticias.
Aquí sigo, ya lo saben.

Siempre estaré`
        },

        g05: {
            token: "f1c8a9e2b6d7a0f4e3c5b9d8a6e7f2c1",
            message: `Para Zoe:
Ojalá este tiempo venga más tranquilo,
con momentos bonitos
y menos prisas.

Emi sigue creciendo rodeado de amor,
y eso se nota mucho.
Qué bonito verlos.

Que las cosas se acomoden poco a poco,
¿cómo van por allá?

Siempre estaré`
        },

        g06: {
            token: "6e4a2c9f7b1d8e0f5a3c6b9e2d7a8f1",
            message: `Para:
Solo paso a recordarte
que vas bien,
aunque a veces no se sienta así.

Confía en tu paso
y no sueltes lo que quieres construir.
Aquí estoy, ¿sí?

Siempre estaré`
        },

        g07: {
            token: "0f3a9e7b6c2d4f1a8e5b9c7d6f2a1e4",
            message: `Para:
Que estos días traigan claridad
y un poco de aire fresco.

A veces no se trata de correr,
sino de acomodar bien las cosas.
¿Todo en orden?

Cuenta conmigo.

Siempre estaré`
        },

        g08: {
            token: "b2c9a6e7f0d4a1e8c3b5f9d7a2e6",
            message: `Para Tío Oscar:
Quería agradecerle
los días que pude estar en su casa.

El trato,
el espacio,
y la convivencia.

Todo eso se valora
más de lo que a veces se dice.

Le deseo un inicio de año tranquilo,
con salud
y días en calma 
con un exito que grite muy fuerte.


Siempre estaré`
        },

        g09: {
            token: "8f7d1a6e2c9b5a0f3e4d7c8b1f9e6",
            message: `Para:
Que poco a poco
te acerques a lo que quieres,
sin forzarte tanto.

Confía en tu proceso.
Aquí estoy si lo necesitas,
¿vale?

Siempre estaré`
        },

        g10: {
            token: "c4b8a9f0e2d7a1c6b3f5e9d8a7",
            message: `Para:
A veces solo hace falta
un poco de claridad
y seguir avanzando.

Que estos días traigan enfoque
y buenas señales.
¿Cómo te has sentido?

Siempre estaré`
        },

        g11: {
            token: "1e7c9b5f2a8d6e0a4c3b9f7d1e",
            message: `Para Mamá:
Solo quería desearte tranquilidad.

Que estos días se sientan más ligeros,
con momentos buenos
y salud.

Aunque no siempre esté cerca,
pienso en ti
y sabes que cuentas conmigo.
¿Cómo vas?

Siempre estaré`
        },

        g12: {
            token: "d0a7e9f1b6c8a2e5d4f3c9b7a",
            message: `Para Tío Lalo:
Que estos días vengan con impulso,
pero también con calma.

Gracias por empujarme a crecer
y por confiar.
Seguimos aprendiendo,
paso a paso.    

Que este año se cumplan todas tus metas
Que tu buena vibra siga alegrando vidas
Que la vida le de lo mejor a los mejores

Siempre estaré`
        },

        g13: {
            token: "5f3b1a9e7d0c2f8a6b4e9d1c7",
            message: `Para Daniel:
Se siente que vienen cosas buenas.

Confío en lo que estás construyendo
y en todo lo que puede salir de ahí.
Ojalá pronto coincidamos más
y armemos algo juntos.

¿Cómo vas arrancando?

Siempre estaré`
        },

        g14: {
            token: "a3f1c9e7d4b2a8f0c6e1d9b7a5c3f8e2d0b6a9c1e7f3d8a2b5c0e6d1f9a7",
            message: `Para Armando:
Cada quien va a su ritmo,
y eso está bien.

Solo quería recordarte
que puedes contar conmigo,
igual que yo contigo.

Que estos días traigan calma
y buenas decisiones.
¿Cómo vas?

Siempre estaré`
        },

        g15: {
            token: "b6d0f2a9c4e7f1d3a8b5c2e9f0d7a6c1e8b3d9f4a0c5e2b7d1f8a3c6e9",
            message: `Tía Sandra:
No quiero decir algo elaborado,
solo agradecerte de verdad.

Por el apoyo.
Por los consejos, incluso sin palabras.
Por abrir tu casa y tu familia.

Admiro lo que han construido.
Y les deseo siempre lo mejor.

Así como ustedes han estado para mí,
yo estaré para ustedes.

Hoy por mí,
mañana por ustedes.

Siempre estaré`
        },


















































































    };

    try {
        const gift = GIFTS[id];

        // Mantengo tu línea “k” pero sin romper el parámetro original:
        const k2 = req.query.token; // <-- integración segura (no rompe const { id, k })

        // Validación estricta: existe el ID y el token coincide exactamente
        if (gift && (gift.token === k || gift.token === k2)) {
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
