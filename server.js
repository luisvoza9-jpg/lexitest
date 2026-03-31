// Esta es la dirección de tu "cocina" en Render que ya está funcionando
const API_URL = "https://lexitest-plus.onrender.com/chat";

async function enviarMensaje() {
    const input = document.getElementById('user-input'); // Asegúrate que el ID sea el de tu web
    const mensaje = input.value;

    if (!mensaje) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mensaje: mensaje,
                contexto: "Eres un asistente de inteligencia artificial avanzado."
            })
        });

        const data = await response.json();
        
        // Aquí es donde la IA te responde en la pantalla
        console.log("Respuesta de la IA:", data);
        // Lógica para mostrar el mensaje en tu chat de Matrix...

    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        alert("ERROR DE CONEXIÓN. El servidor no responde.");
    }
}

