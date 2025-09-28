
import { GoogleGenAI, Type } from "@google/genai";
import type { AiResponse } from '../types';

let ai: GoogleGenAI | null = null;

/**
 * Initializes and returns the GoogleGenAI client instance.
 * Uses a singleton pattern to ensure it's only created once.
 */
function getAiClient(): GoogleGenAI {
  if (ai) {
    return ai;
  }
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
  }
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai;
}


const responseSchema = {
  type: Type.OBJECT,
  properties: {
    action: {
      type: Type.STRING,
      description: "MUST always be 'INFO' for a textual answer.",
      enum: ['INFO'],
    },
    message: {
      type: Type.STRING,
      description: "A conversational, informative message for the user. Explain your analysis, suggestions, or why a request couldn't be fulfilled."
    }
  },
  required: ['action', 'message'],
};


export const generateGeoData = async (prompt: string): Promise<AiResponse> => {
  try {
    const aiClient = getAiClient();
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are an expert urban planning assistant for Dhaka, Bangladesh, with over 10 years of experience. You are named 'AeroScope AI Planner'. Your purpose is to help users analyze the urban environment around key airbases (HSIA, Tejgaon, Mirpur Cantonment).

You will receive a context string before the user's query that describes the current map state (visible layers, selected area). Use this context to inform your response.

- You MUST answer all questions in precise, data-backed, simplified terms that anyone can understand.
- **VERY IMPORTANT**: You MUST NOT generate map data or layers. Your role is purely advisory and informational. You cannot add data to the map.
- **Action**: You MUST always use the 'INFO' action for your response.
- **Summarization**: If asked to summarize, analyze the provided context (visible layers, selected area) and provide a concise, insightful summary of the urban landscape.
- **Suggestion**: If asked to suggest a location for new infrastructure (e.g., "suggest a new park"), analyze the existing data and DESCRIBE a plausible location in text. Explain your reasoning. DO NOT provide coordinates or GeoJSON.
- **Data Queries**: If the user asks you to show something on the map (e.g., "show me commercial zones"), respond by describing where those zones are located in text. DO NOT generate GeoJSON.
- **Clarity**: Ensure the 'message' field is always populated with a friendly, professional response explaining your analysis or suggestions from an urban planning perspective.`,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("AI returned an empty response string.");
    }
    
    const parsedResponse: AiResponse = JSON.parse(jsonText);

    // Basic validation
    if (!parsedResponse.action || !parsedResponse.message) {
      throw new Error("Invalid response structure from AI");
    }
    // Force action to INFO if AI somehow returns something else
    if (parsedResponse.action !== 'INFO') {
        parsedResponse.action = 'INFO';
    }


    return parsedResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      action: 'ERROR',
      message: "I'm sorry, I failed to process that request. The AI model might be unavailable or the response was invalid."
    };
  }
};