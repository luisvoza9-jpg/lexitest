const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// ⚠️ NOTA DE SEGURIDAD: En el futuro, es mejor no poner la API key directamente en el código, pero para esta prueba nos sirve.
const GEMINI_KEY = "AIzaSyCod7qKXcefhTqa4OEVWbl32dygU9G10Aw"; 

// ¡Cambiado a /chat para que coincida con tu web!
app.post('/chat', async (req, res) => {
    const { mensaje, contexto } = req.body;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
        
        // Formato correcto de Axios
        const response = await axios.post(url, {
            contents: [{ 
                parts: [{ 
                    text: `Contexto: ${contexto || 'Sin contexto'}\n\nPregunta: ${mensaje}` 
                }] 
            }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        // Axios guarda la respuesta dentro de .data
        res.json(response.data); 

    } catch (err) {
        console.error("Error en el servidor:", err.message);
        res.status(500).json({ error: "Error de conexión con el núcleo IA" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de operaciones activo en puerto ${PORT}`);
});

