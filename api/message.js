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
Comenzar este 2026 también es mirar atrás
y reconocer todo lo que me enseñaste sin decirlo.

Tu forma de vivir, de cumplir y de sostener
sigue siendo una referencia para mí.
Mucho de lo que soy viene de ahí.

Este año te deseo calma, salud
y tiempo para disfrutar lo que has construido.
Que vivas a tu ritmo, como quieres,
con la tranquilidad que mereces.

Yo sigo avanzando,
y eso también es gracias a ti.

Feliz.`
        },

        g02: {
            token: "c8a1f3e7b6d2a9e0c4f8d5b7e1a3c9f6d2a8b0e4f7c1",
            message: `Para Diego y familia:
Arrancar 2026 es otra oportunidad
para seguir creciendo juntos.

Les deseo salud, estabilidad
y muchos momentos tranquilos en familia.
Que Liam siga creciendo rodeado de cariño,
ejemplo y buena energía.

Sabes que cuentan conmigo,
para lo bueno, para los proyectos
y para lo que venga.

Vamos con todo este año.

Feliz.`
        },

        g03: {
            token: "7e0f1c3a8d2b6f9e5a4c7b1d0f8e9a2c6b3d4f7e1",
            message: `Para Tía Elsa:
Este nuevo año quiero decirte gracias,
otra vez y siempre.

Tu forma de estar, de cuidar
y de acompañar en silencio
ha sido muy importante para mí.

Te deseo un 2026 lleno de salud,
tranquilidad y momentos buenos.
Que sigas rodeada de calma
y de todo lo que te haga sentir bien.

Feliz.`
        },

        g04: {
            token: "2a9c6e7f0b4d8f1e3c5a7d6b9e0f2a8c4",
            message: `Para Mariana y familia:
Empezar 2026 también es reconocer
a quienes han estado siempre.

Gracias por seguir presentes,
por acompañar y por sostener
en todas las etapas.

Les deseo un año con salud,
prosperidad y estabilidad.
Aquí sigo, como siempre,
cuenten conmigo.

Feliz.`
        },

        g05: {
            token: "f1c8a9e2b6d7a0f4e3c5b9d8a6e7f2c1",
            message: `Para Zoe:
Que este 2026 llegue con calma,
con momentos buenos
y con todo lo necesario para seguir avanzando.

Que Emi siga creciendo rodeado de amor
y de la fuerza que ustedes le transmiten cada día.

Confío en que este año traerá cosas buenas,
más ligeras y más claras para ustedes.

Feliz.`
        },

        g06: {
            token: "6e4a2c9f7b1d8e0f5a3c6b9e2d7a8f1",
            message: `Para:
Que este 2026 te empuje a confiar más en ti,
a avanzar con constancia
y a no soltar lo que quieres construir.

Cuentas conmigo para este camino.

Feliz.`
        },

        g07: {
            token: "0f3a9e7b6c2d4f1a8e5b9c7d6f2a1e4",
            message: `Para:
Nuevo año, nuevas oportunidades.
Que este 2026 te traiga enfoque,
energía y buenas decisiones.

Aquí estoy para lo que necesites.

Feliz.`
        },

        g08: {
            token: "b2c9a6e7f0d4a1e8c3b5f9d7a2e6",
            message: `Para Tío Oscar:
Arrancar 2026 también es agradecer
todo lo aprendido con ustedes.

Cada ejemplo, consejo o rutina
ha dejado algo bueno en mi camino.

Les deseo mucha salud,
estabilidad y prosperidad,
no solo este año,
sino en todos los que vienen.

Feliz.`
        },

        g09: {
            token: "8f7d1a6e2c9b5a0f3e4d7c8b1f9e6",
            message: `Para:
Que este 2026 te acerque
a lo que realmente quieres.
Confía en tu proceso.

Cuenta conmigo.

Feliz.`
        },

        g10: {
            token: "c4b8a9f0e2d7a1c6b3f5e9d8a7",
            message: `Para:
Nuevo año, nueva energía.
Que este 2026 venga con claridad,
avance y buenos resultados.

Aquí estoy.

Feliz.`
        },

        g11: {
            token: "1e7c9b5f2a8d6e0a4c3b9f7d1e",
            message: `Para Mamá:
Comenzar 2026 también es desearte paz.

Aunque no siempre esté cerca,
quiero que sepas que pienso en ti
y que siempre cuentas conmigo.

Te deseo salud, tranquilidad
y muchos momentos buenos este año.
Que todo sea más ligero.

Feliz.`
        },

        g12: {
            token: "d0a7e9f1b6c8a2e5d4f3c9b7a",
            message: `Para Tío Lalo:
Que este 2026 venga con impulso,
con ideas claras y con caminos abiertos.

Gracias por confiar en mí
y por empujarme a crecer.
Seguimos avanzando,
aprendiendo y construyendo.

Feliz.`
        },

        g13: {
            token: "5f3b1a9e7d0c2f8a6b4e9d1c7",
            message: `Para Daniel:
Este 2026 se siente como un año clave.

Confío en tu crecimiento,
en lo que estás construyendo
y en todo lo que viene.

Ojalá coincidamos más,
armemos cosas juntos
y llevemos ideas a otro nivel.

Vamos con todo.

Feliz.`
        },

        g14: {
            token: "a3f1c9e7d4b2a8f0c6e1d9b7a5c3f8e2d0b6a9c1e7f3d8a2b5c0e6d1f9a7",
            message: `Para Armando:
Que este 2026 siga abriendo caminos.

Aunque cada quien vaya a su ritmo,
quiero que sepas que puedes contar conmigo,
igual que yo contigo.

Te deseo tranquilidad,
buenos momentos
y claridad para avanzar.

Feliz.`
        },

        g15: {
            token: "b6d0f2a9c4e7f1d3a8b5c2e9f0d7a6c1e8b3d9f4a0c5e2b7d1f8a3c6e9",
            message: `Para Tía Sandra:
Este nuevo año quiero desearte
algo más que buenos deseos.

Te deseo un 2026 lleno de salud,
sorpresas bonitas y momentos que se queden.
Que cada día traiga algo bueno,
aunque sea pequeño,
pero real.

Gracias por tu presencia,
por tu apoyo constante
y por hacer que la familia se sienta hogar.
Valoro mucho tu compañía
y todo lo que compartimos.

Que este año te regrese
todo lo bueno que das.

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
