const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_KEY = "AIzaSyCod7qKXcefhTqa4OEVWbl32dygU9G10Aw"; 

app.post('/chat', async (req, res) => {
    const { mensaje, contexto } = req.body;
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: `Contexto: ${contexto || 'Asistente'}\n\nPregunta: ${mensaje}` }] }]
        });
        res.json(response.data); 
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});

