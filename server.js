const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_KEY = process.env.GEMINI_KEY; 

app.post('/chat', async (req, res) => {
    // Capturamos 'mensaje' y 'contexto' que vienen de tu index.html
    const { mensaje, contexto } = req.body;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
        
        // Enviamos a Google con el formato exacto que pide
        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: `${contexto || ""} \n\n Pregunta del usuario: ${mensaje}` }]
            }]
        });
        
        res.json(response.data); 

    } catch (err) {
        console.error("Error en el servidor:", err.message);
        res.status(500).json({ error: "Fallo al conectar con Gemini" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo y listo`);
});

