const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function iniciarBaseDeDatos() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS mensajes_chat (
                id SERIAL PRIMARY KEY,
                remitente VARCHAR(50) DEFAULT 'Visitante',
                mensaje TEXT NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Base de datos lista.");
    } catch (error) {
        console.error("❌ Error de BD:", error);
    }
}
iniciarBaseDeDatos();

// ── Diccionarios de Respuestas Personalizadas para Daniel Campos ──

const respuestasSaludo = [
    "¡Hola! Qué gusto saludarte. 👋 Soy el asistente virtual de Daniel Campos. ¿En qué puedo orientarte hoy sobre su perfil o proyectos?",
    "¡Buen día! Bienvenido al portafolio de Daniel. ¿Deseas conocer más sobre sus habilidades en desarrollo, análisis de sistemas o canales de contacto?",
    "¡Hola! Con gusto puedo responder tus preguntas sobre la formación, proyectos o disponibilidad laboral de Daniel. ¿De qué te gustaría hablar?"
];

const respuestasDespedida = [
    "¡Hasta pronto! Gracias por visitar el portafolio de Daniel. Si deseas coordinar algo más, puedes escribirle a danielicawork@gmail.com. 👋",
    "¡Que tengas un excelente día! Recuerda que puedes dejar tu correo o mensaje aquí y Daniel lo revisará a la brevedad.",
    "¡Hasta luego! Quedo a tu disposición por si necesitas consultar algo más sobre el perfil de Daniel."
];

const respuestasGracias = [
    "¡Con mucho gusto! Estoy aquí para facilitarte la información sobre el trabajo y capacidades de Daniel.",
    "¡Para servirte! Si requieres detalles adicionales sobre algún proyecto o servicio, no dudes en preguntar.",
    "¡A la orden! Recuerda que también puedes usar el formulario de contacto de la página para enviarle un mensaje directo."
];

const respuestasBot = [
    "Soy el asistente virtual de Daniel Campos. Fui desarrollado con Node.js, Express y PostgreSQL para atender consultas en tiempo real y registrar tus mensajes en su base de datos. 🤖",
    "¡Hola! Soy un bot creado para representar el portafolio de Daniel. Permito interactuar con los visitantes y guardar sus mensajes de forma segura.",
    "Soy una aplicación web full-stack de asistencia virtual. Demuestro la capacidad de Daniel para integrar interfaces frontend con servicios backend y bases de datos en la nube."
];

const respuestasTecnologias = [
    "Daniel domina los fundamentos de desarrollo web: HTML5 estructurado y accesible, CSS para estilizado y maquetación de componentes, y JavaScript para lógica de eventos y manipulación del DOM. 💻",
    "En el área técnica, Daniel trabaja con HTML5, CSS y JavaScript básico. Además, cuenta con formación en Análisis y Diseño de Sistemas para modelar soluciones lógicas y bien estructuradas.",
    "El stack técnico de Daniel incluye desarrollo frontend con HTML, CSS, JavaScript, y conocimientos en arquitectura de sistemas, Git/GitHub y bases de datos relacionales."
];

const respuestasAnalisis = [
    "Daniel está formándose en Análisis y Diseño de Sistemas. Su enfoque principal es desglosar requerimientos complejos, diagramar procesos y diseñar arquitecturas de software claras y escalables. 📊",
    "El fuerte de Daniel radica en el pensamiento analítico: capacidad para estructurar la lógica de negocio antes de programar, asegurando soluciones organizadas y eficientes.",
    "Además de la programación web, Daniel aplica metodologías de análisis de sistemas para comprender las necesidades del cliente y traducirlas en especificaciones técnicas sólidas."
];

const respuestasProyectos = [
    "Daniel desarrolla proyectos prácticos orientados a resolver necesidades reales: sitios web informativos, componentes interactivos con JavaScript y aplicaciones como este mismo chatbot conectado a PostgreSQL. 🚀",
    "Puedes revisar sus fortalezas y canales de contacto directamente en este portafolio. Daniel siempre está construyendo iniciativas prácticas para ampliar su experiencia.",
    "Entre sus iniciativas destacan proyectos académicos, maquetación web y herramientas interactivas. ¡Este chat que estás usando es una demostración directa de integración web!"
];

const respuestasContacto = [
    "Puedes contactar a Daniel directamente por correo en danielicawork@gmail.com, o a través de sus perfiles en LinkedIn (linkedin.com/in/daniel-junior) y GitHub (github.com/daniel-code). ✉️",
    "¡Por supuesto! Escribe tu correo o número de contacto en este chat y quedará registrado de forma segura para que Daniel te responda lo antes posible. 📬",
    "Para solicitudes laborales o proyectos freelance, puedes utilizar el formulario al final de la página o escribirle directamente a danielicawork@gmail.com."
];

const respuestasDisponibilidad = [
    "Daniel se encuentra disponible para asumir retos como pasantías, oportunidades laborales Junior o proyectos freelance en maquetación y desarrollo web. 🤝",
    "¡Sí! Daniel tiene total disposición y entusiasmo para integrarse a equipos de tecnología donde pueda aportar su capacidad analítica y seguir creciendo profesionalmente.",
    "Daniel está abierto a propuestas laborales y colaboraciones. Si representas a una empresa o tienes un proyecto en mente, puedes contactarlo en danielicawork@gmail.com."
];

const respuestasServicios = [
    "Daniel ofrece servicios de creación de sitios web, maquetación frontend limpia, adaptación de interfaces y apoyo en análisis y especificación de sistemas. 🛠️",
    "Los servicios que puedes solicitar incluyen: desarrollo de páginas web, diseño responsivo, estructuración de código frontend y propuestas para proyectos independientes.",
    "Para conocer cotizaciones o tiempos de entrega, cuéntame brevemente qué necesitas o escríbele a danielicawork@gmail.com para coordinar una propuesta a medida."
];

const respuestasFortalezas = [
    "Las principales fortalezas de Daniel son su alta adaptabilidad, pensamiento analítico estructurado, responsabilidad con los plazos y una sólida disposición al aprendizaje continuo. ⭐",
    "Daniel destaca por su capacidad de asimilar feedback constructivo, comunicarse con claridad y fundamentar sus soluciones técnicas con criterio lógico.",
    "Compromiso y constancia definen el perfil de Daniel: aprende rápido nuevas herramientas y mantiene una actitud profesional ante cualquier reto técnico."
];

const respuestasGeneral = [
    "Mensaje recibido y guardado en la base de datos de Daniel. 📝 ¿Te gustaría conocer detalles sobre sus habilidades técnicas, análisis de sistemas o datos de contacto?",
    "He registrado tu mensaje correctamente. ¿Deseas saber más acerca de los proyectos de Daniel, sus fortalezas profesionales o cómo contratar sus servicios?",
    "Información guardada. Estoy a tu disposición para hablar sobre la formación de Daniel, su experiencia con HTML/CSS/JavaScript o coordinar una propuesta laboral."
];

function elegir(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ── Endpoint Principal de Chat ──
app.post('/api/chat', async (req, res) => {
    const mensajeUsuario = req.body && req.body.mensaje ? req.body.mensaje : '';

    if (!mensajeUsuario.trim()) {
        return res.status(400).json({ error: "El mensaje no puede estar vacío." });
    }

    try {
        // 1. Guardar mensaje en base de datos PostgreSQL
        await pool.query('INSERT INTO mensajes_chat (mensaje) VALUES ($1)', [mensajeUsuario]);

        const texto = mensajeUsuario.toLowerCase();
        let respuestaBot = "";

        // 2. Coincidencia de Intenciones
        const esSaludo = ['hola', 'buenas', 'buen día', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos', 'hey', 'que tal', 'qué tal'].some(p => texto.includes(p));
        const esDespedida = ['adiós', 'adios', 'chao', 'nos vemos', 'hasta luego', 'bye', 'hasta pronto', 'me voy'].some(p => texto.includes(p));
        const esGracias = ['gracias', 'genial', 'perfecto', 'excelente', 'buena', 'muchas gracias', 'ok', 'vale', 'listo'].some(p => texto.includes(p));
        const preguntaBot = ['qué eres', 'que eres', 'quién eres', 'quien eres', 'bot', 'asistente', 'inteligencia', 'robot', 'chat'].some(p => texto.includes(p));
        const preguntaAnalisis = ['análisis', 'analisis', 'diseño de sistemas', 'diagrama', 'procesos', 'requerimientos', 'analista'].some(p => texto.includes(p));
        const preguntaTecnologias = ['tecnología', 'tecnologia', 'skills', 'sabes', 'lenguaje', 'programar', 'html', 'css', 'javascript', 'stack', 'herramientas'].some(p => texto.includes(p));
        const preguntaProyectos = ['proyecto', 'trabajos', 'portafolio', 'experiencia', 'has hecho', 'desarrollado', 'creado'].some(p => texto.includes(p));
        const preguntaContacto = ['contacto', 'correo', 'email', 'teléfono', 'telefono', 'whatsapp', 'escribir', 'hablar', 'comunicar'].some(p => texto.includes(p));
        const preguntaDisponibilidad = ['disponible', 'disponibilidad', 'trabajar', 'contratar', 'empleo', 'pasantía', 'pasantia', 'freelance', 'oportunidad', 'laboral'].some(p => texto.includes(p));
        const preguntaServicios = ['servicio', 'precio', 'cuánto', 'cuanto', 'cobras', 'tarifa', 'cotización', 'cotizacion', 'presupuesto', 'página web', 'sitio web'].some(p => texto.includes(p));
        const preguntaFortalezas = ['fortaleza', 'cualidad', 'oportunidades', 'destaca', 'por qué', 'porque', 'ventajas', 'habilidades blandas'].some(p => texto.includes(p));

        // 3. Resolución de Respuesta
        if (esSaludo) {
            respuestaBot = elegir(respuestasSaludo);
        } else if (esDespedida) {
            respuestaBot = elegir(respuestasDespedida);
        } else if (esGracias) {
            respuestaBot = elegir(respuestasGracias);
        } else if (preguntaBot) {
            respuestaBot = elegir(respuestasBot);
        } else if (preguntaAnalisis) {
            respuestaBot = elegir(respuestasAnalisis);
        } else if (preguntaTecnologias) {
            respuestaBot = elegir(respuestasTecnologias);
        } else if (preguntaProyectos) {
            respuestaBot = elegir(respuestasProyectos);
        } else if (preguntaContacto) {
            respuestaBot = elegir(respuestasContacto);
        } else if (preguntaDisponibilidad) {
            respuestaBot = elegir(respuestasDisponibilidad);
        } else if (preguntaServicios) {
            respuestaBot = elegir(respuestasServicios);
        } else if (preguntaFortalezas) {
            respuestaBot = elegir(respuestasFortalezas);
        } else {
            respuestaBot = elegir(respuestasGeneral);
        }

        res.json({ respuesta: respuestaBot });

    } catch (error) {
        console.error("Error en /api/chat:", error);
        res.status(500).json({ respuesta: "Ocurrió una interrupción temporal al consultar la base de datos. Por favor, intenta de nuevo." });
    }
});

// Endpoint para consultar el historial de mensajes
app.get('/api/mensajes', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT id, remitente, mensaje, fecha FROM mensajes_chat ORDER BY fecha DESC');
        res.json(resultado.rows);
    } catch (error) {
        console.error("Error en /api/mensajes:", error);
        res.status(500).json({ error: "No fue posible leer los registros de la base de datos." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Bot de Daniel Campos encendido y escuchando en el puerto ${PORT}`);
});
