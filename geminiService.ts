
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, GeneratedResult } from "./types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeAndGenerate(input: UserInput, highQuality: boolean = false): Promise<GeneratedResult> {
    // Stage 1: Analyze Input to get context and a perfect prompt
    const analysisResponse = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          ...(input.type === 'IMAGE' ? [{ inlineData: { data: input.content, mimeType: input.mimeType || 'image/jpeg' } }] : []),
          { text: `Analyze the following ${input.type.toLowerCase()} input: "${input.content.substring(0, 5000)}". 
            Provide a descriptive title, a concise 2-sentence explanation of the topic, 3 interesting facts, and a highly detailed prompt for an image generator to create a realistic, cinematic masterpiece representing this topic.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            facts: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            imagePrompt: { type: Type.STRING }
          },
          required: ["title", "description", "facts", "imagePrompt"]
        }
      }
    });

    const analysis = JSON.parse(analysisResponse.text);

    // Stage 2: Generate Image
    const modelName = highQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    
    // If Pro image model is used, we need to ensure AI client is fresh (per instructions)
    const activeAi = highQuality ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : this.ai;

    const imageResponse = await activeAi.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: analysis.imagePrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: highQuality ? "2K" : "1K"
        }
      }
    });

    let imageUrl = '';
    for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    return {
      imageUrl,
      title: analysis.title,
      description: analysis.description,
      facts: analysis.facts
    };
  }
}
