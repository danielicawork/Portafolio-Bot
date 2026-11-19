const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Permite que tu portafolio se comunique con este bot
app.use(cors());
app.use(express.json()); 

// Llave maestra para conectar a Render
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Obligatorio en Render
});

// Función para crear la tabla de mensajes si no existe
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
        console.log("✅ Base de datos lista y conectada a Render.");
    } catch (error) {
        console.error("❌ Error conectando a la base de datos:", error);
    }
}
iniciarBaseDeDatos();

// El bot escuchando los mensajes que lleguen
app.post('/api/chat', async (req, res) => {
    const mensajeUsuario = req.body.mensaje;

    try {
        // 1. Guardar el mensaje del visitante en Render
        await pool.query('INSERT INTO mensajes_chat (mensaje) VALUES ($1)', [mensajeUsuario]);

        // 2. Pensar en una respuesta
        let respuestaBot = "¡Hola! He guardado tu mensaje en mi base de datos. Te contactaré pronto.";
        
        // Si el visitante pregunta algo específico, el bot cambia su respuesta:
        if (mensajeUsuario.toLowerCase().includes('tecnologías')) {
            respuestaBot = "Soy un bot creado con Node.js y conectado a PostgreSQL en Render.";
        }

        // 3. Enviar la respuesta de vuelta al portafolio
        res.json({ respuesta: respuestaBot });
    } catch (error) {
        console.error("Error al guardar el mensaje:", error);
        res.status(500).json({ respuesta: "Error del servidor." });
    }
});

// Encender el servidor en tu computadora
const PORT = 3000;
app.listen(PORT, () => {
    console.log(` Bot encendido y escuchando en http://localhost:${PORT}`);
});