const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chat = onRequest({ secrets: ["GEMINI_API_KEY"] }, async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") { res.status(204).send(""); return; }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const mensajeUsuario = req.body.message;

        // --- LÓGICA DE COMPORTAMIENTO ---
        let promptFinal = "";

        // Si el mensaje es muy largo (un PDF inyectado), entra en MODO ESTUDIO
        if (mensajeUsuario.length > 500) { 
            promptFinal = `Eres LEXITEST ELITE. Has recibido un documento extenso. 
            Analízalo y genera: 1. Un RESUMEN y 2. PREGUNTAS DE EXAMEN. 
            Aquí está el texto: ${mensajeUsuario}`;
        } 
        // Si el mensaje es corto, entra en MODO CHAT normal
        else {
            promptFinal = `Eres LEXITEST ELITE, una IA de terminal avanzada, con un toque cínico y profesional. 
            Responde de forma breve y concisa al siguiente saludo o pregunta: ${mensajeUsuario}`;
        }

        const result = await model.generateContent(promptFinal);
        res.json({ response: result.response.text() });

    } catch (e) {
        res.status(500).json({ response: "ERROR_SISTEMA: " + e.message });
    }
});

