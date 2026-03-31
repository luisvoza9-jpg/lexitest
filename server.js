// 1. CONEXIÓN AL SERVIDOR (DIRECCIÓN DE RENDER)
const API_URL = "https://lexitest-plus.onrender.com/chat";

// Función para enviar mensajes
async function enviarMensaje() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const mensaje = input.value.trim();

    if (!mensaje) return;

    // Mostrar lo que escribes
    chatBox.innerHTML += `<div style="color: #00ff00; margin: 5px 0;">> TÚ: ${mensaje}</div>`;
    input.value = ""; 

    try {
        // Llamada al servidor que acabas de activar
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mensaje: mensaje,
                contexto: "Eres un asistente de élite."
            })
        });

        const data = await response.json();

        // Mostrar la respuesta de la IA
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const respuestaIA = data.candidates[0].content.parts[0].text;
            chatBox.innerHTML += `<div style="color: #ffffff; margin: 10px 0; border-left: 2px solid #00ff00; padding-left: 5px;">>> SISTEMA: ${respuestaIA}</div>`;
        } else {
            chatBox.innerHTML += `<div style="color: orange;">>> SISTEMA: Recibido, pero sin respuesta clara.</div>`;
        }

    } catch (error) {
        console.error("Error:", error);
        chatBox.innerHTML += `<div style="color: red;">>> ERROR: NO HAY CONEXIÓN CON EL SERVIDOR.</div>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Escuchar la tecla Enter
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        enviarMensaje();
    }
});

