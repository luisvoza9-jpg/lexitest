const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chat = onRequest({ 
    cors: true, 
    secrets: ["GEMINI_API_KEY"],
    region: "us-central1" 
}, async (req, res) => {
    try {
        // Inicializamos la IA con la clave de Firebase Secrets
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // AQUÍ ESTÁ EL CAMBIO: Usamos "gemini-pro" que es el que funciona con tu versión
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Pillamos lo que envías desde la web
        const prompt = req.body.prompt || "Hola";
        
        // Generamos la respuesta
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Devolvemos la respuesta al HTML
        res.json({ response: text });

    } catch (error) {
        console.error("ERROR EN SERVIDOR:", error);
        res.status(500).json({ 
            error: "FALLO DE NÚCLEO", 
            detalle: error.message 
        });
    }
});

