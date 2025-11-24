
import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Simulates the "FunASR" step.
 * Since running FunASR logic purely in frontend is complex, we use Gemini 2.5 Flash
 * which has excellent native audio transcription capabilities.
 */
export const transcribeAudio = async (mediaBlob: Blob): Promise<string> => {
  try {
    // CHECK FILE SIZE: Browser XHR fails often around 20MB for Base64 payloads.
    // Lowering to 10MB for stability in this demo environment.
    const sizeInMB = mediaBlob.size / (1024 * 1024);
    if (sizeInMB > 10) {
      throw new Error(`File is too large (${sizeInMB.toFixed(1)}MB). Maximum allowed for browser processing is 10MB.`);
    }

    const ai = getAiClient();
    
    // Convert Blob to Base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Robustly split standard data URLs: "data:video/mp4;base64,AAAA..."
        const base64String = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(mediaBlob);
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mediaBlob.type || 'video/mp4', // Gemini handles video directly, extracting audio
              data: base64Data
            }
          },
          {
            text: "Please transcribe the spoken audio in this video verbatim. Output ONLY the transcription, no other text."
          }
        ]
      }
    });

    return response.text || "Transcription failed.";
  } catch (error: any) {
    console.error("Transcription Error:", error);
    if (error.message && error.message.includes("File is too large")) {
      throw error;
    }
    throw new Error("AI processing failed. The file might be too large for browser upload. Try a shorter video.");
  }
};

/**
 * Rewrites the script based on user instructions.
 */
export const rewriteScript = async (originalText: string, userInstruction: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const prompt = `
      You are an expert short video scriptwriter.
      
      Original Transcript:
      """
      ${originalText}
      """
      
      User Instruction:
      "${userInstruction}"
      
      Task: Rewrite the original transcript into a new, engaging short video script based on the user's instruction.
      Keep the tone fast-paced and suitable for TikTok/Douyin.
      Output ONLY the new script.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Rewriting failed.";
  } catch (error) {
    console.error("Rewrite Error:", error);
    throw new Error("Failed to rewrite script.");
  }
};
