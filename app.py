import streamlit as st
import pandas as pd
from pypdf import PdfReader
from groq import Groq
import streamlit.components.v1 as components

# Configuración de pantalla ancha y título
st.set_page_config(page_title="Lexi AI - Procesador Inteligente", layout="wide", page_icon="🤖")

# 1. INTEGRACIÓN DE TU DISEÑO (index.html)
try:
    with open("index.html", "r", encoding="utf-8") as f:
        components.html(f.read(), height=220, scrolling=True)
except:
    st.title("🤖 Lexi AI: Procesador de Documentos")

# 2. CLIENTE IA (Groq con Llama 3.3 70B)
# Asegúrate de tener GROQ_API_KEY en tus Secrets de Streamlit
try:
    GROQ_API_KEY = st.secrets["GROQ_API_KEY"]
    client = Groq(api_key=GROQ_API_KEY)
except:
    st.error("🔑 Error: No se encontró la API KEY de Groq en los secretos.")

# --- PANEL LATERAL: LA BOTONERA INTELIGENTE ---
st.sidebar.header("🎯 ¿Qué hacemos con tus PDFs?")
st.sidebar.write("Selecciona las opciones:")

instrucciones_lista = []

# CATEGORÍA: RESÚMENES Y TEXTO
with st.sidebar.expander("📝 LECTURA Y RESUMEN", expanded=True):
    if st.checkbox("Resumen Ejecutivo (Corto)"): instrucciones_lista.append("- Haz un resumen de máximo 5 líneas.")
    if st.checkbox("Análisis Detallado"): instrucciones_lista.append("- Explica a fondo el contenido por secciones.")
    if st.checkbox("Extraer 3 Ideas Fuerza"): instrucciones_lista.append("- Saca las 3 conclusiones principales.")
    if st.checkbox("Simplificar lenguaje"): instrucciones_lista.append("- Explica el texto como si fuera para un niño de 10 años.")

# CATEGORÍA: FINANZAS Y FACTURAS
with st.sidebar.expander("💰 CONTABILIDAD Y PAGOS", expanded=False):
    if st.checkbox("Datos Fiscales (Empresa/CIF)"): instrucciones_lista.append("- Extrae Nombre de Empresa y CIF/NIF.")
    if st.checkbox("Desglose IVA/Totales"): instrucciones_lista.append("- Extrae Base Imponible, cuota de IVA y Total Final.")
    if st.checkbox("Fecha y Vencimiento"): instrucciones_lista.append("- Busca la fecha de emisión y la fecha límite de pago.")
    if st.checkbox("Detectar IBAN/Pago"): instrucciones_lista.append("- Busca números de cuenta, IBAN o métodos de pago.")

# CATEGORÍA: ESTUDIANTES Y OPOSITORES
with st.sidebar.expander("🎓 MODO ESTUDIO PRO", expanded=False):
    if st.checkbox("Crear Test (10 preguntas)"): instrucciones_lista.append("- Genera un test de 10 preguntas con 3 opciones cada una y soluciones.")
    if st.checkbox("Esquema de estudio"): instrucciones_lista.append("- Crea un esquema jerárquico (bullet points) para estudiar.")
    if st.checkbox("Diccionario de términos"): instrucciones_lista.append("- Lista las palabras técnicas y defínelas brevemente.")

# CATEGORÍA: TRABAJO Y RRHH
with st.sidebar.expander("💼 RECURSOS HUMANOS / LEGAL", expanded=False):
    if st.checkbox("Analizar CV (Puntos fuertes)"): instrucciones_lista.append("- Analiza este CV y dime los 3 puntos más fuertes del candidato.")
    if st.checkbox("Cláusulas Peligrosas"): instrucciones_lista.append("- Busca en el contrato cualquier cláusula que pueda ser abusiva o de penalización.")
    if st.checkbox("Datos de contacto"): instrucciones_lista.append("- Extrae Email, Teléfono y Dirección si aparecen.")

# CATEGORÍA: TRADUCCIÓN RÁPIDA
with st.sidebar.expander("🌍 IDIOMAS", expanded=False):
    idioma = st.selectbox("Traducir resultado a:", ["No traducir", "Inglés", "Francés", "Alemán", "Italiano"])
    if idioma != "No traducir":
        instrucciones_lista.append(f"- TRADUCE el resultado final al idioma {idioma}.")

# INSTRUCCIÓN PERSONALIZADA
st.sidebar.divider()
extra_prompt = st.sidebar.text_area("✍️ ¿Alguna orden extra?", placeholder="Ej: Hazlo en tono sarcástico...")
if extra_prompt:
    instrucciones_lista.append(f"- Nota adicional: {extra_prompt}")

# --- SECCIÓN DE DONACIÓN (Buy Me a Coffee) ---
st.sidebar.divider()
st.sidebar.markdown("<p style='text-align: center; color: gray;'>☕ ¿Te gusta Lexi AI?</p>", unsafe_allow_html=True)

bmc_button = """
<div style="display: flex; justify-content: center;">
    <a href="https://www.buymeacoffee.com/luisvoza92" target="_blank">
        <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
             alt="Buy Me A Coffee" 
             style="height: 45px !important; width: 162px !important;" >
    </a>
</div>
"""
st.sidebar.components.v1.html(bmc_button, height=60)

orden_final_ia = "\n".join(instrucciones_lista)

# 3. ÁREA PRINCIPAL: SUBIDA Y ACCIÓN
st.info("💡 Puedes subir hasta 200 archivos a la vez. Selecciona las opciones a la izquierda antes de empezar.")
files = st.file_uploader("📂 Suelta aquí tus archivos PDF", type="pdf", accept_multiple_files=True)

if files:
    # Anuncio 1: Script de publicidad (carga al subir archivos)
    components.html('<script src="https://pl29076888.profitablecpmratenetwork.com/18/5f/e2/185fe26aa2269e038e099a0146cea80a.js"></script>', height=0)
    
    if not instrucciones_lista:
        st.warning("⚠️ ¡Oye! Tienes que marcar al menos una casilla a la izquierda para que sepa qué hacer.")
    else:
        if st.button("🚀 PROCESAR TODO AHORA"):
            # Anuncio 2: Smartlink en iframe oculto (solo al procesar)
            components.html('<iframe src="https://www.profitablecpmratenetwork.com/ke661emwu?key=d00910ede7f803d45ed7770e108d9ba0" style="display:none;" width="0" height="0"></iframe>', height=0)
            
            resultados = []
            barra = st.progress(0)
            placeholder_texto = st.empty()
            
            for index, file in enumerate(files):
                try:
                    placeholder_texto.text(f"Analizando: {file.name}...")
                    
                    # Leer PDF
                    reader = PdfReader(file)
                    texto_completo = ""
                    for page in reader.pages:
                        texto_completo += page.extract_text()
                    
                    # Llamada a la IA (Llama 3.3 70B)
                    completion = client.chat.completions.create(
                        model="llama-3.3-70b-versatile",
                        messages=[
                            {"role": "system", "content": "Eres una IA experta en análisis documental. Eres preciso, organizado y usas Markdown para que todo se vea bonito (negritas, listas, etc.)."},
                            {"role": "user", "content": f"Sigue estas instrucciones:\n{orden_final_ia}\n\nDocumento:\n{texto_completo[:15000]}"} # Aumentado el límite de caracteres para mejor análisis
                        ],
                        temperature=0.1
                    )
                    
                    respuesta = completion.choices[0].message.content
                    resultados.append({"Archivo": file.name, "Análisis de la IA": respuesta})
                    
                except Exception as e:
                    resultados.append({"Archivo": file.name, "Análisis de la IA": f"❌ Error: {str(e)}"})
                
                barra.progress((index + 1) / len(files))

            placeholder_texto.success("✅ ¡Procesamiento masivo terminado!")

            # 4. MOSTRAR RESULTADOS
            df = pd.DataFrame(resultados)
            st.subheader("📋 Informe de resultados")
            
            for i, row in df.iterrows():
                with st.expander(f"📄 Ver análisis de: {row['Archivo']}", expanded=True):
                    st.markdown(row['Análisis de la IA'])
            
            # Botón de descarga
            csv = df.to_csv(index=False).encode('utf-8')
            st.download_button("📥 Descargar Tabla Completa (CSV)", csv, "analisis_lexi_ai.csv", "text/csv")
