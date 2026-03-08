/**
 * Prompt template for improving a single resume bullet point.
 *
 * Design principle: Instructs Gemini to apply the STAR method (Situation, Task,
 * Action, Result) and embed quantifiable metrics wherever possible. This makes
 * bullets both ATS-friendly and compelling to human reviewers.
 */
export function buildImproveBulletPrompt(
  bullet: string,
  role?: string,
  context?: string
): string {
  return `You are an expert resume writer and career coach.

Your task is to rewrite the following resume bullet point to be more impactful, specific, and ATS-friendly.

GUIDELINES:
- Start with a strong action verb (e.g., Engineered, Spearheaded, Optimized)
- Include quantifiable results where possible (%, $, time saved, team size)
- Keep it concise — ideally one sentence, max two
- Use industry-relevant keywords naturally
- Apply the STAR method: imply Situation/Task, show Action, state Result
- Avoid first-person pronouns (no "I", "my", "we")

${role ? `TARGET ROLE: ${role}` : ""}
${context ? `ADDITIONAL CONTEXT: ${context}` : ""}

ORIGINAL BULLET POINT:
${bullet}

Return ONLY the improved bullet point text. No explanation, no preamble, no quotes.`;
}
