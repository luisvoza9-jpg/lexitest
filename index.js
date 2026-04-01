const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chat = onRequest({ cors: true }, async (req, res) => {
    try {
        // 1. Usamos la llave que tienes guardada en Google Cloud (process.env)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // 2. Usamos el modelo más estable
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 3. Capturamos el mensaje que envías desde la web
        const prompt = req.body.prompt || req.body.message || req.body.mensaje || "Hola";

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 4. Enviamos la respuesta de vuelta
        res.json({ response: text });

    } catch (error) {
        console.error("ERROR EN LA IA:", error);
        res.status(500).json({ error: error.message });
    }
});

