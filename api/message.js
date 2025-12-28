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
Gracias por todo lo que me has enseñado a lo largo de estos años.
Tu paciencia, tu responsabilidad y tu forma de estar
han sido una escuela para mí.

Tal vez no siempre fue con palabras,
pero aprendí mirando,
aprendí con el ejemplo.

Los próximos años asegúrate de disfrutar,
de vivir como quieres
y estar donde quieras.

Ya es mi turno.

Te deseo años llenos de salud, tranquilidad
y buenos momentos.
Que sigas siendo esa persona tan presente 
y tan humana que eres.

Feliz.`
        },

        g02: {
            token: "c8a1f3e7b6d2a9e0c4f8d5b7e1a3c9f6d2a8b0e4f7c1",
            message: `Para Diego y familia:
Les deseo un año lleno de salud, aprendizaje y crecimiento.
Que sigamos siendo mejores vecinos, compadres y amigos,
pero sobre todo, familia.

Que Liam crezca rodeado de cariño, ejemplo y tranquilidad.

Sabes que cuentan conmigo siempre,
y que me alegra compartir el camino y muchos momentos más.

Te deseo años llenos de salud, tranquilidad
y buenos momentos.

Feliz.`
        },

        g03: {
            token: "7e0f1c3a8d2b6f9e5a4c7b1d0f8e9a2c6b3d4f7e1",
            message: `Para Tía Elsa:
Gracias, de corazón.

Desde siempre me has hecho sentir acompañado y cuidado,
incluso sin decir muchas palabras.
Tu forma de estar, de acercarte y de proteger
ha significado mucho para mí.

Te deseo años llenos de salud, tranquilidad
y buenos momentos.
Que sigas siendo esa persona tan presente 
y tan humana que eres.

Feliz.`
        },

        g04: {
            token: "2a9c6e7f0b4d8f1e3c5a7d6b9e0f2a8c4",
            message: `Para Mariana y familia:
Hemos sido y siempre seremos una misma familia.
Desde mocoso, en los días buenos y en los malos,
has estado, y eso no se olvida.

Gracias por tu presencia constante,
por acompañar, por sostener
y por formar parte de mi vida de una manera tan cercana.

Les deseo un año lleno de salud, calma y prosperidad,
y quiero que sepan que siempre cuentan conmigo.

Feliz.`
        },

        g05: {
            token: "f1c8a9e2b6d7a0f4e3c5b9d8a6e7f2c1",
            message: `Para :

            disponible



Feliz.`
        },

        g06: {
            token: "6e4a2c9f7b1d8e0f5a3c6b9e2d7a8f1",
            message: `Para:


            disponible


Feliz.`
        },

        g07: {
            token: "0f3a9e7b6c2d4f1a8e5b9c7d6f2a1e4",
            message: `Para :

            disponible


Feliz.`
        },

        g08: {
            token: "b2c9a6e7f0d4a1e8c3b5f9d7a2e6",
            message: `Para Tío Oscar:
Cuando se trata de agradecer, las palabras nunca alcanzan del todo.
A lo largo de mi vida, tú y la familia 
han aportado cosas positivas a mi camino,
a veces sin darse cuenta:
una rutina, un ejemplo, un consejo.

Todo eso lo guardo y lo valoro profundamente.
Sigo aprendiendo de ustedes,
y espero seguir haciéndolo por muchos años más.

Les deseo mucha salud y prosperidad,
no solo en el próximo año,
sino en todos los que vienen.

Feliz.`
        },

        g09: {
            token: "8f7d1a6e2c9b5a0f3e4d7c8b1f9e6",
            message: `Para :


            disponible


Feliz.`
        },

        g10: {
            token: "c4b8a9f0e2d7a1c6b3f5e9d8a7",
            message: `Para:

            disponible


Feliz.`
        },

        g11: {
            token: "1e7c9b5f2a8d6e0a4c3b9f7d1e",
            message: `Para Mamá:
Aunque no siempre esté cerca, eso no cambia lo que siento por ti.
La vida me llevó a construir desde otro lugar,
pero tú sigues siendo parte de mi camino y de quien soy.

Te deseo un año lleno de salud, tranquilidad y prosperidad,
y muchos años más con momentos buenos,
con calma y con todo lo que te haga sentir en paz.

Te quiero,
y quiero que sepas que siempre cuentas conmigo.

Feliz.`
        },

        g12: {
            token: "d0a7e9f1b6c8a2e5d4f3c9b7a",
            message: `Para Tío Lalo:
Que esta luz acompañe tus días
y te recuerde que siempre hay camino por delante.

Gracias por estar, por confiar en mí
y por darme ese impulso que me ayuda a superarme.
Contigo he aprendido que la vida no tiene límites
y que equivocarse no es el final,
sino parte del aprendizaje.

Gracias por compartir,
por enseñar a disfrutar el proceso
y por ser parte de mi 2025.

Feliz.`
        },

        g13: {
            token: "5f3b1a9e7d0c2f8a6b4e9d1c7",
            message: `Para Daniel:
Te deseo un año lleno de salud, fuerza y prosperidad.
Me da gusto ver el cambio que has tenido y cómo has ido creciendo para bien.

Que el próximo año te acerque a tu mejor versión,
que sigas aprendiendo, construyendo
y llevando tus ideas más lejos.

Ojalá podamos coincidir más,
trabajar juntos en proyectos y negocios
y lograr todo eso que sabemos que es posible.

Te deseo todo el éxito del mundo, bro.
Vamos por más.

Feliz.`
        },

        g14: {
            token: "a3f1c9e7d4b2a8f0c6e1d9b7a5c3f8e2d0b6a9c1e7f3d8a2b5c0e6d1f9a7",
            message: `Para Armando:
Que esta luz acompañe tus días
y te recuerde que siempre hay camino por delante.

Aunque la vida nos lleve por rutas distintas,
quiero que sepas que puedes contar conmigo,
así como yo cuento contigo.

Gracias por estar, por compartir
y por formar parte de mi historia.

Te deseo tranquilidad, buenos momentos
y un año que siga abriendo caminos.

Feliz.`
        },

        g15: {
            token: "b6d0f2a9c4e7f1d3a8b5c2e9f0d7a6c1e8b3d9f4a0c5e2b7d1f8a3c6e9",
            message: `Para Tia Sandra:
Cuando se trata de ustedes, 
sí tengo la familia que quiero.

Gracias por su apoyo, su presencia 
y todo lo que dan sin pedir nada a cambio.
Por estar, por cuidar, por sostener 
y por hacer que la familia se sienta completa.

Valoro tanto su compñia que sus rutinas,
Son un ejemplo para mí.
Mis vicotrias se sienten suyas,
Y el exito se siente compartido.

Te deseo mucha salud y prosperidad,
No solo para el próximo año,
Sino para todos los que vienen.

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
