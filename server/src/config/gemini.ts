import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

export const gemini = new GoogleGenAI({ apiKey });

export const DEFAULT_MODEL = "gemini-2.0-flash";

export interface GenerateOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  systemInstruction?: string;
}

/**
 * Generate text from a prompt using Gemini.
 * Returns the raw text response.
 */
export async function generateText(
  prompt: string,
  options: GenerateOptions = {}
): Promise<string> {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxOutputTokens = 2048,
    systemInstruction,
  } = options;

  const config: Record<string, unknown> = {
    temperature,
    maxOutputTokens,
  };
  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }

  const response = await gemini.models.generateContent({
    model,
    contents: prompt,
    config,
  });

  return response.text ?? "";
}

/**
 * Generate a structured JSON response from Gemini.
 * Wraps the prompt in JSON-mode instructions and parses the output.
 */
export async function generateStructured<T>(
  prompt: string,
  options: GenerateOptions = {}
): Promise<T> {
  const jsonPrompt = `${prompt}

IMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation, no code blocks. Just the raw JSON object.`;

  const raw = await generateText(jsonPrompt, {
    ...options,
    temperature: options.temperature ?? 0.3,
  });

  // Strip any accidental markdown fences
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(cleaned) as T;
}
