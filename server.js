const express = require('express');
const cors = require('cors');
const fetch = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_KEY = "AIzaSyCod7qKXcefhTqa4OEVWbl32dygU9G10Aw"; 

app.post('/api/consultar', async (req, res) => {
    const { mensaje, contexto } = req.body;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `Contexto: ${contexto}\n\nPregunta: ${mensaje}` 
                    }] 
                }]
            })
        });
        
        const data = await response.json();
        res.json(data); 

    } catch (err) {
        res.status(500).json({ error: "Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});

