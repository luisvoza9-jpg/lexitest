const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chat = onRequest({ 
    cors: true, 
    secrets: ["GEMINI_API_KEY"],
    region: "us-central1" 
}, async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Usamos el modelo moderno garantizado
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = req.body.prompt || "Hola";
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ response: text });

    } catch (error) {
        console.error("ERROR REAL EN EL SERVIDOR:", error);
        res.status(500).json({ 
            error: "FALLO DE NÚCLEO", 
            detalle: error.message 
        });
    }
});

