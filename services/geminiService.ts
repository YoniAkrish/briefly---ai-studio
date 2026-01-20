import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MeetingAnalysis } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Helper to determine MIME type if browser fails to detect it
 */
const getMimeType = (file: File): string => {
  if (file.type && file.type !== '') return file.type;
  
  const ext = file.name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    case 'm4a': return 'audio/mp4';
    case 'mp4': return 'video/mp4';
    case 'webm': return 'video/webm';
    case 'ogg': return 'audio/ogg';
    default: return 'application/octet-stream';
  }
};

/**
 * Converts a File object to a Base64 string usable by Gemini (For small files)
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const base64Content = base64data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: getMimeType(file),
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads a file to Gemini using the Resumable Upload protocol (For large files)
 */
const uploadToGemini = async (file: File, onStatusUpdate: (msg: string) => void): Promise<{ fileUri: string, mimeType: string }> => {
  onStatusUpdate("Initiating upload connection...");
  
  const mimeType = getMimeType(file);
  const fileSize = file.size.toString();

  // 1. Start the resumable upload session
  const initResponse = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'X-Goog-Upload-Protocol': 'resumable',
      'X-Goog-Upload-Command': 'start',
      'X-Goog-Upload-Header-Content-Length': fileSize,
      'X-Goog-Upload-Header-Content-Type': mimeType,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file: { display_name: file.name } }),
  });

  if (!initResponse.ok) {
    const errText = await initResponse.text();
    throw new Error(`Upload initialization failed (${initResponse.status}): ${errText}`);
  }

  const uploadUrl = initResponse.headers.get('X-Goog-Upload-URL');
  if (!uploadUrl) throw new Error("Failed to retrieve upload URL from Gemini.");

  // 2. Upload the actual bytes
  // Note: We do NOT set 'Content-Length' manually here; the browser does it. 
  // We do NOT set 'Content-Type' manually; the browser sets it based on the File object.
  onStatusUpdate("Uploading file data (this may take a while)...");
  
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'X-Goog-Upload-Offset': '0',
      'X-Goog-Upload-Command': 'upload, finalize',
    },
    body: file, 
  });

  if (!uploadResponse.ok) {
    const errText = await uploadResponse.text();
    throw new Error(`File upload failed (${uploadResponse.status}): ${errText}`);
  }

  const uploadResult = await uploadResponse.json();
  return { fileUri: uploadResult.file.uri, mimeType: mimeType };
};

/**
 * Polls the file status until it is ACTIVE (processed)
 */
const waitForFileActive = async (fileUri: string, onStatusUpdate: (msg: string) => void) => {
  onStatusUpdate("Processing audio file on Gemini servers...");
  const name = fileUri.split('/files/')[1];
  
  if (!name) throw new Error("Invalid file URI returned.");

  let isActive = false;
  let attempts = 0;
  
  while (!isActive) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/files/${name}?key=${apiKey}`);
    
    if (!response.ok) {
       throw new Error(`Status check failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.state === 'ACTIVE') {
      isActive = true;
    } else if (data.state === 'FAILED') {
      throw new Error("File processing failed on Gemini servers (State: FAILED).");
    } else {
      attempts++;
      if (attempts > 60) { // Timeout after ~2 minutes of processing
         throw new Error("File processing timed out.");
      }
      // Wait 2 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

/**
 * Defines the expected JSON schema for the output
 */
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative and relevant title for the meeting." },
    summary: { type: Type.STRING, description: "A concise executive summary of the meeting (2-3 paragraphs)." },
    keyPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of the most important points discussed."
    },
    actionItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING },
          assignee: { type: Type.STRING, description: "Person responsible, or 'Unassigned'" },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
        },
        required: ["task", "assignee", "priority"]
      },
      description: "List of actionable tasks derived from the meeting."
    },
    decisions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key decisions made during the meeting."
    },
    sentiment: { type: Type.STRING, description: "Overall tone/sentiment of the meeting (e.g., Productive, Tense, Optimistic)." },
    attendees: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of names of people identified or mentioned as present."
    }
  },
  required: ["title", "summary", "keyPoints", "actionItems", "decisions", "sentiment"]
};

/**
 * Main function to analyze the meeting file
 */
export const analyzeMeeting = async (
  file: File, 
  onStatusUpdate: (status: string) => void = () => {}
): Promise<MeetingAnalysis> => {
  try {
    if (!apiKey) {
      throw new Error("API Key is missing. Please check your environment configuration.");
    }

    let contentPart: any;
    const LARGE_FILE_THRESHOLD = 9 * 1024 * 1024; // 9MB

    if (file.size > LARGE_FILE_THRESHOLD) {
      // Large File Strategy: Upload via Files API
      const { fileUri, mimeType } = await uploadToGemini(file, onStatusUpdate);
      await waitForFileActive(fileUri, onStatusUpdate);
      
      contentPart = {
        fileData: {
          mimeType: mimeType,
          fileUri: fileUri
        }
      };
    } else {
      // Small File Strategy: Inline Base64
      onStatusUpdate("Encoding audio locally...");
      contentPart = await fileToGenerativePart(file);
    }

    onStatusUpdate("Generating summary...");
    const modelId = "gemini-3-flash-preview";
    
    const prompt = `
      You are an expert Executive Assistant. Listen to the attached meeting recording and generate a structured report.
      
      Focus on:
      1. Creating a clear, professional summary.
      2. Extracting concrete action items with assignees (if mentioned, otherwise guess based on context or mark unassigned).
      3. Identifying key decisions made.
      4. Capturing the general sentiment.
      
      Be precise and professional.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          contentPart,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, 
      }
    });

    const responseText = response.text;
    
    if (!responseText) {
      throw new Error("No response received from Gemini.");
    }

    // Parse the JSON response
    const analysis: MeetingAnalysis = JSON.parse(responseText);
    return analysis;

  } catch (error) {
    console.error("Error analyzing meeting:", error);
    throw error;
  }
};