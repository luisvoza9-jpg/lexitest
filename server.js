const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// LA CLAVE: Aquí no hay llaves reales, solo esta frase
const GEMINI_KEY = process.env.GEMINI_KEY; 

app.post('/chat', async (req, res) => {
    try {
        const { mensaje } = req.body;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
        
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: mensaje }] }]
        });

        const textoIA = response.data.candidates[0].content.parts[0].text;
        res.json({ respuesta: textoIA });

    } catch (err) {
        // Si falla, los logs de Render nos dirán por qué
        res.status(500).json({ error: "Error en la IA" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => { console.log("Servidor ONLINE"); });

