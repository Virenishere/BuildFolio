/**
 * ATS Optimization Chain
 *
 * Architecture: This is the most complex chain. It:
 * 1. Loads resume as documents (RAG document loader)
 * 2. Retrieves relevant context using keyword matching
 * 3. Calls Gemini with a structured JSON prompt
 * 4. Validates the response shape before returning
 *
 * The structured output (matchScore, missingKeywords, suggestions) is designed
 * to be rendered directly in the frontend ATS panel without further parsing.
 */
import { generateStructured, generateText, GenerateOptions } from "../../config/gemini";
import {
  buildAtsOptimizationPrompt,
  buildSuggestSkillsPrompt,
  buildRewriteExperiencePrompt,
  AtsOptimizationResult,
} from "../prompts/atsOptimization.prompt";
export type { AtsOptimizationResult };
import { loadResumeDocuments } from "../../rag/documentLoader";
import { retrieveContext } from "../../rag/retriever";
import { IResume } from "../../models/resumeModel";

export interface AtsOptimizationInput {
  resume: IResume;
  jobDescription: string;
}

export interface SuggestSkillsInput {
  resume: IResume;
  targetRole?: string;
}

export interface SuggestSkillsOutput {
  technicalSkills: string[];
  softSkills: string[];
  certifications: string[];
  reasoning: string;
}

export interface RewriteExperienceInput {
  description: string;
  role: string;
  company: string;
}

export interface RewriteExperienceOutput {
  original: string;
  bullets: string[];
}

export async function atsOptimizationChain(
  input: AtsOptimizationInput,
  options: GenerateOptions = {}
): Promise<AtsOptimizationResult> {
  const documents = loadResumeDocuments(input.resume);

  // Use JD as the query to retrieve the most JD-relevant resume sections
  const contextDocs = retrieveContext(input.jobDescription, documents, 8);
  const resumeContext = contextDocs.map((d) => d.content).join("\n\n");

  const prompt = buildAtsOptimizationPrompt(resumeContext, input.jobDescription);

  return generateStructured<AtsOptimizationResult>(prompt, {
    temperature: 0.3,
    maxOutputTokens: 1024,
    ...options,
  });
}

export async function suggestSkillsChain(
  input: SuggestSkillsInput,
  options: GenerateOptions = {}
): Promise<SuggestSkillsOutput> {
  const documents = loadResumeDocuments(input.resume);
  const query = `skills ${input.targetRole ?? "software engineer"} technologies`;
  const contextDocs = retrieveContext(query, documents, 4);
  const resumeContext = contextDocs.map((d) => d.content).join("\n\n");

  const prompt = buildSuggestSkillsPrompt(resumeContext, input.targetRole);

  return generateStructured<SuggestSkillsOutput>(prompt, {
    temperature: 0.4,
    maxOutputTokens: 512,
    ...options,
  });
}

export async function rewriteExperienceChain(
  input: RewriteExperienceInput,
  options: GenerateOptions = {}
): Promise<RewriteExperienceOutput> {
  const prompt = buildRewriteExperiencePrompt(
    input.description,
    input.role,
    input.company
  );

  const raw = await generateText(prompt, {
    temperature: 0.65,
    maxOutputTokens: 512,
    ...options,
  });

  // Parse bullet lines from response
  const bullets = raw
    .split("\n")
    .map((line: string) => line.replace(/^[•\-*]\s*/, "").trim())
    .filter((line: string) => line.length > 0);

  return {
    original: input.description,
    bullets,
  };
}

