app.post('/chat', async (req, res) => {
    try {
        // 1. Forzamos a que lea el mensaje sea cual sea el nombre
        const userMsg = req.body.message || req.body.mensaje || req.body.q;
        
        console.log("Intentando hablar con Google usando el mensaje:", userMsg);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`;
        
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: userMsg }] }]
        });

        const textoIA = response.data.candidates[0].content.parts[0].text;
        res.json({ response: textoIA });

    } catch (err) {
        // 2. ESTO ES LO QUE NECESITO QUE MIRES EN LOS LOGS
        console.error("DETALLE DEL FALLO:");
        if (err.response) {
            console.error(JSON.stringify(err.response.data));
        } else {
            console.error(err.message);
        }
        res.status(500).json({ error: "Fallo en el núcleo" });
    }
});

