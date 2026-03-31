const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuramos la IA con tu llave de Render
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        // Usamos Gemini 1.5 Flash (el más rápido y con nivel gratuito)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });

    } catch (error) {
        console.error("ERROR EN GOOGLE AI:", error);
        
        // Si Google da error, esto te dirá por qué en el log de Render
        res.status(500).json({ 
            error: "Error en el servidor de IA", 
            message: error.message 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 SERVIDOR LEXITEST ONLINE EN PUERTO ${PORT}`);
});

