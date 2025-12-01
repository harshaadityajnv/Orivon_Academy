
import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

// This function will be called once before starting the proctoring session.
export function initializeAiService(): void {
  if (ai) return; // Already initialized

  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API Key is not configured. Proctoring cannot start.");
  }
  ai = new GoogleGenAI({ apiKey: API_KEY });
}


const PROMPT = `Analyze this image from a student's webcam during an exam. Identify any of the following proctoring violations: 
- 'looking-away': The student's face is visible but they are not looking towards the screen.
- 'multiple-faces': More than one face is detected in the image.
- 'phone-detected': A mobile phone or tablet is visible in the image.
- 'face-unclear': The student's face is obscured, too dark, or blurry.
- 'no-face': No face is detected in the image.

The student should be looking directly at the camera. Your response must be a valid JSON object.`;

export async function analyzeFrame(base64Image: string): Promise<string[]> {
  if (!ai) {
    // This should not happen if initializeAiService is called correctly.
    console.error("AI Service not initialized before analyzing frame.");
    return [];
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          { text: PROMPT },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            violations: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "An array of strings listing any detected proctoring violations.",
            },
          },
        },
      },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    if (result && Array.isArray(result.violations)) {
      return result.violations;
    }
    return [];
  } catch (error) {
    console.error("Error analyzing frame with Gemini:", error);
    return [];
  }
}
