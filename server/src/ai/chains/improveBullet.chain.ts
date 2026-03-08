/**
 * ImproveBullet Chain
 *
 * Architecture: This follows the LangChain chain pattern — each chain is a
 * composable unit that takes typed input, builds a prompt, calls the LLM, and
 * returns typed output. This allows chains to be tested in isolation and
 * composed into larger pipelines (e.g., an "improve entire experience" pipeline
 * that loops this chain over every bullet).
 */
import { generateText, GenerateOptions } from "../../config/gemini";
import { buildImproveBulletPrompt } from "../prompts/improveBullet.prompt";

export interface ImproveBulletInput {
  bullet: string;
  role?: string;
  context?: string;
}

export interface ImproveBulletOutput {
  original: string;
  improved: string;
}

export async function improveBulletChain(
  input: ImproveBulletInput,
  options: GenerateOptions = {}
): Promise<ImproveBulletOutput> {
  const prompt = buildImproveBulletPrompt(input.bullet, input.role, input.context);

  const improved = await generateText(prompt, {
    temperature: 0.6,
    maxOutputTokens: 256,
    ...options,
  });

  return {
    original: input.bullet,
    improved: improved.trim(),
  };
}
