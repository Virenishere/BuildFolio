/**
 * ResumeSummary Chain
 *
 * Architecture: This chain first runs the RAG retriever to pull the most
 * relevant resume sections into context before sending to Gemini. This ensures
 * the summary is grounded in the actual resume content rather than hallucinated.
 * When a vector DB is added, the retriever call is the only thing that changes.
 */
import { generateText, GenerateOptions } from "../../config/gemini";
import { buildSummaryPrompt } from "../prompts/summary.prompt";
import { retrieveContext } from "../../rag/retriever";
import { loadResumeDocuments, ResumeDocument } from "../../rag/documentLoader";
import { IResume } from "../../models/resumeModel";

export interface ResumeSummaryInput {
  resume: IResume;
  targetRole?: string;
}

export interface ResumeSummaryOutput {
  summary: string;
  contextUsed: ResumeDocument[];
}

export async function resumeSummaryChain(
  input: ResumeSummaryInput,
  options: GenerateOptions = {}
): Promise<ResumeSummaryOutput> {
  const documents = loadResumeDocuments(input.resume);

  // Retrieve the most relevant sections for summary generation
  const query = `professional summary ${input.targetRole ?? ""} experience skills`;
  const contextDocs = retrieveContext(query, documents, 5);

  const resumeContext = contextDocs.map((d) => d.content).join("\n\n");
  const prompt = buildSummaryPrompt(resumeContext, input.targetRole);

  const summary = await generateText(prompt, {
    temperature: 0.7,
    maxOutputTokens: 512,
    ...options,
  });

  return {
    summary: summary.trim(),
    contextUsed: contextDocs,
  };
}
