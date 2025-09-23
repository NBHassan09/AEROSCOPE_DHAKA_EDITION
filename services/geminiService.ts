
import { GoogleGenAI, Type } from "@google/genai";
import type { AiResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    action: {
      type: Type.STRING,
      description: "The GIS action to perform. Can be 'ADD_LAYER' if returning GeoJSON, 'INFO' for a textual answer, or 'ERROR' for a failure.",
      enum: ['ADD_LAYER', 'INFO', 'ERROR'],
    },
    layerName: {
      type: Type.STRING,
      description: "A descriptive name for the new layer, relevant to the user's query. E.g., 'Capitals in Europe', 'Parks near Eiffel Tower'."
    },
    geojsonData: {
      type: Type.OBJECT,
      description: "A complete GeoJSON FeatureCollection object. This should only be included if the action is 'ADD_LAYER'.",
      properties: {
        type: { type: Type.STRING, enum: ['FeatureCollection'] },
        features: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ['Feature'] },
              properties: {
                type: Type.OBJECT,
                description: "A JSON object containing properties for the feature. Must include a 'name' property.",
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "Name of the feature (e.g., 'Eiffel Tower', 'France').",
                  },
                },
                required: ['name'],
              },
              geometry: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'] },
                  coordinates: {
                    type: Type.ARRAY,
                    description: "Coordinates array following GeoJSON spec. Can be nested for complex shapes.",
                    // This schema technically describes a Point's coordinates: [num, num].
                    // This is the simplest case and satisfies the 'items: missing field' error.
                    // The model is expected to generate correctly nested arrays for other geometries.
                    items: {
                        type: Type.NUMBER
                    }
                  }
                },
                required: ['type', 'coordinates']
              }
            },
            required: ['type', 'properties', 'geometry']
          }
        }
      },
      nullable: true,
    },
    message: {
      type: Type.STRING,
      description: "A conversational, informative message for the user. Explain what data is being shown or why a request couldn't be fulfilled."
    }
  },
  required: ['action', 'message'],
};


export const generateGeoData = async (prompt: string): Promise<AiResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are an expert urban planning assistant for Dhaka, Bangladesh, with over 10 years of experience. You are named 'Dhaka AI Planner'. Your purpose is to help users analyze the urban environment around key airbases (HSIA, Tejgaon, Mirpur Cantonment).
- You MUST answer all questions in precise, data-backed, simplified terms that anyone can understand.
- Understand user queries related to urban infrastructure, population density, zoning, and strategic planning (e.g., "show me commercial zones near Tejgaon", "find all parks within 5km of HSIA", "plot major roads connecting Mirpur and HSIA").
- If the user's request can be represented as geographic data, you MUST respond with an 'ADD_LAYER' action and a valid GeoJSON FeatureCollection relevant to Dhaka.
- Generate realistic, high-quality, and plausible data if the exact data is not available to you. For example, for "commercial zones", create a few polygons representing markets or business districts.
- ALWAYS include a 'name' property in each feature's properties object for labeling.
- If the user asks a question that is analytical or informational (e.g., "what are the planning challenges around Tejgaon?"), respond with the 'INFO' action and provide a helpful text answer in the 'message' field. Do not generate GeoJSON for INFO actions.
- Ensure the 'message' field is always populated with a friendly, professional response explaining what you've done or what you're providing, framed from an urban planning perspective.`,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse: AiResponse = JSON.parse(jsonText);

    // Basic validation
    if (!parsedResponse.action || !parsedResponse.message) {
      throw new Error("Invalid response structure from AI");
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
