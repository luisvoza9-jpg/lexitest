const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_KEY = "AIzaSyCod7qKXcefhTqa4OEVWbl32dygU9G10Aw"; 

app.post('/chat', async (req, res) => {
    // Capturamos 'mensaje' porque así lo envía tu index.html
    const { mensaje } = req.body;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
        
        // CORRECCIÓN AQUÍ: Gemini necesita 'contents' y 'parts'
        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: mensaje }]
            }]
        });
        
        res.json(response.data); 

    } catch (err) {
        console.error("Error detallado:", err.response ? err.response.data : err.message);
        res.status(500).json({ error: "Fallo en la comunicación con la IA" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});

