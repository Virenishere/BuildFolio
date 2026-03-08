/**
 * Keyword-Based Retriever (in-memory RAG)
 *
 * Architecture decision: We deliberately avoid a vector DB at this stage to
 * reduce infrastructure complexity and cold-start latency. The keyword-based
 * approach still produces excellent retrieval for resume content because resumes
 * are structured, domain-specific documents where keyword overlap is high.
 *
 * Retrieval algorithm: TF-style scoring — count how many unique query tokens
 * appear in each document's content (case-insensitive). Documents are ranked by
 * score and top-K are returned.
 *
 * Vector DB migration path:
 * 1. Implement IVectorProvider (see vector/vector.interface.ts)
 * 2. Embed documents via provider.upsert() in documentLoader
 * 3. Replace retrieveContext() body with provider.query()
 * 4. All chain code remains unchanged
 */
import { ResumeDocument } from "./documentLoader";

/**
 * Tokenise a text string into a set of lowercase words.
 * Strips punctuation and common stop-words to improve signal.
 */
function tokenise(text: string): Set<string> {
  const STOP_WORDS = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "not", "no", "nor",
    "so", "yet", "both", "either", "neither", "each", "few", "more", "most",
    "other", "some", "such", "than", "too", "very", "just", "as", "if",
  ]);

  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
  );
}

export interface ScoredDocument {
  document: ResumeDocument;
  score: number;
}

/**
 * Score a single document against a query using token overlap.
 */
function scoreDocument(query: string, doc: ResumeDocument): number {
  const queryTokens = tokenise(query);
  const docTokens = tokenise(doc.content);

  let score = 0;
  queryTokens.forEach((token) => {
    if (docTokens.has(token)) {
      score += 1;
    }
  });

  // Boost summary and experience sections slightly — they're usually the most
  // relevant context for AI prompts.
  if (doc.section === "summary") score *= 1.3;
  if (doc.section === "experience") score *= 1.2;
  if (doc.section === "skills") score *= 1.1;

  return score;
}

/**
 * Retrieve the top-K most relevant documents for a query.
 * Returns all documents if k >= documents.length.
 */
export function retrieveContext(
  query: string,
  documents: ResumeDocument[],
  k: number = 5
): ResumeDocument[] {
  if (documents.length === 0) return [];

  const scored: ScoredDocument[] = documents.map((doc) => ({
    document: doc,
    score: scoreDocument(query, doc),
  }));

  scored.sort((a, b) => b.score - a.score);

  // Always include at least one doc even if score is 0 (fallback)
  const topK = scored.slice(0, Math.max(1, Math.min(k, documents.length)));
  return topK.map((s) => s.document);
}

/**
 * Retrieve documents filtered by section type, then rank by query relevance.
 * Useful when you know you only need experience entries, for example.
 */
export function retrieveBySection(
  query: string,
  documents: ResumeDocument[],
  section: ResumeDocument["section"],
  k: number = 3
): ResumeDocument[] {
  const sectionDocs = documents.filter((d) => d.section === section);
  return retrieveContext(query, sectionDocs, k);
}
