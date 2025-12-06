
import { GoogleGenAI, Type } from "@google/genai";
import { Suggestion, SuggestionCategory } from "../types";

// Safety check for Vercel/Browser environments where process might be undefined
declare var process: any;
const getApiKey = () => {
  try {
    return (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
  } catch (e) {
    return '';
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateSuggestions = async (category: SuggestionCategory): Promise<Suggestion[]> => {
  let promptText = "";

  // Define specific prompts based on the selected category
  switch (category) {
    case 'presentation':
      promptText = "Genera 3 presentaciones o introducciones MUY BREVES y sencillas para predicar de casa en casa. Deben ser respetuosas, amables y fáciles de decir. Basadas en sugerencias recientes de la Guía de Actividades de jw.org.";
      break;
    case 'practical':
      promptText = "Genera 3 consejos prácticos para ser eficientes en el territorio (ej: cómo anotar revisitas, uso del carrito, predicación informal). Basado en jw.org.";
      break;
    case 'safety':
      promptText = "Genera 3 recordatorios breves sobre seguridad, modales o cuidado al predicar (ej: no dejar tratados visibles en casas vacías, cuidado con perros, discreción al hablar). Basado en principios de jw.org.";
      break;
    case 'scripture':
    default:
      promptText = "Genera 3 textos bíblicos ANIMADORES para un grupo de predicación. Deben ser citas EXACTAS de la Traducción del Nuevo Mundo (TNM) en español. Enfocados en el aguante, el amor y el apoyo de Jehová.";
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "Eres un asistente para testigos de Jehová. Tu fuente de información es EXCLUSIVAMENTE jw.org y wol.jw.org. Para textos bíblicos, usas ÚNICAMENTE la 'Traducción del Nuevo Mundo de las Santas Escrituras' (TNM) en español. El tono es animador, breve y teocrático.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                enum: ["scripture", "presentation", "practical", "safety"],
                description: "La categoría solicitada"
              },
              text: {
                type: Type.STRING,
                description: "El contenido principal"
              },
              reference: {
                type: Type.STRING,
                description: "La referencia (Cita bíblica TNM, o 'Basado en jw.org')",
                nullable: true
              }
            },
            required: ["text"]
          }
        }
      }
    });

    const rawJSON = response.text;
    if (!rawJSON) return [];
    
    const parsed = JSON.parse(rawJSON);
    
    // Add IDs and ensure category matches logic
    return parsed.map((item: any, index: number) => ({
      ...item,
      category: category, // Force the category to match the request
      id: `gen-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Error generating suggestions:", error);
    // Fallbacks specific to category
    if (category === 'scripture') {
      return [{ id: 'err-1', category: 'scripture', text: "Arroja tu carga sobre Jehová mismo, y él mismo te sustentará.", reference: "Salmo 55:22" }];
    }
    return [{ id: 'err-2', category: 'practical', text: "Por favor, verifica tu conexión para ver nuevas sugerencias.", reference: "Error de conexión" }];
  }
};
