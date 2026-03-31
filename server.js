const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// USAMOS EL NOMBRE QUE PUSIMOS EN RENDER
const API_KEY = process.env.GOOGLE_API_KEY; 

app.post('/chat', async (req, res) => {
    try {
        // CAMBIO: Ahora recibe "message" (igual que el nuevo index.html)
        const { message } = req.body;
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: message }] }]
        });

        // Extraemos el texto de la respuesta de Google
        const textoIA = response.data.candidates[0].content.parts[0].text;
        
        // CAMBIO: Respondemos con "response" (igual que el nuevo index.html)
        res.json({ response: textoIA });

    } catch (err) {
        console.error("ERROR EN IA:", err.response ? err.response.data : err.message);
        res.status(500).json({ error: "Fallo en el núcleo de la IA" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => { console.log("Servidor LEXITEST ONLINE"); });

