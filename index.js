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

// Ruta principal del Chat
app.post('/api/chat', async (req, res) => {
    const mensajeUsuario = req.body.mensaje;

    try {
        await pool.query('INSERT INTO mensajes_chat (mensaje) VALUES ($1)', [mensajeUsuario]);

        const texto = mensajeUsuario.toLowerCase();
        let respuestaBot = "";

        const esSaludo = ['hola', 'buenas', 'qué tal', 'que tal', 'saludos'].some(p => texto.includes(p));
        const preguntaTecnologias = ['tecnología', 'tecnologia', 'skills', 'sabes', 'lenguaje'].some(p => texto.includes(p));
        const preguntaProyectos = ['proyecto', 'trabajo', 'portafolio', 'experiencia'].some(p => texto.includes(p));
        const preguntaContacto = ['contacto', 'correo', 'email', 'teléfono', 'contratar'].some(p => texto.includes(p));

        if (esSaludo) {
            respuestaBot = "¡Hola! Qué gusto saludarte. 👋 Soy el asistente de este portafolio, ¿en qué te puedo ayudar?";
        } else if (preguntaTecnologias) {
            respuestaBot = "Mi creador se especializa en herramientas como React, Node.js y bases de datos. 💻"; // <-- CAMBIAR POR LAS DEL AMIGO
        } else if (preguntaProyectos) {
            respuestaBot = "Puedes ver los proyectos principales haciendo scroll en esta misma página.";
        } else if (preguntaContacto) {
            respuestaBot = "Déjame tu correo o número de contacto aquí y lo guardaré de forma segura para que te escriban pronto. ✉️";
        } else {
            const respuestasVariadas = [
                "Ya guardé este mensaje en la base de datos. ¿Te gustaría saber algo sobre los proyectos o tecnologías?",
                "¡Anotado! 📝 ¿Puedo ayudarte con alguna otra duda?",
                "Registrado correctamente. ¿Quieres que hablemos sobre habilidades o prefieres dejar tu contacto?"
            ];
            respuestaBot = respuestasVariadas[Math.floor(Math.random() * respuestasVariadas.length)];
        }

        res.json({ respuesta: respuestaBot });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ respuesta: "Error de conexión temporal. Intenta de nuevo." });
    }
});

app.get('/api/mensajes', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM mensajes_chat ORDER BY fecha DESC');
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al leer la base de datos" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Bot encendido y escuchando en el puerto ${PORT}`);
});