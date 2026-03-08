/**
 * Prompt template for generating an ATS-friendly professional summary.
 *
 * Design principle: A good ATS summary front-loads the job title keyword,
 * quantifies years of experience, and lists 3-4 core competencies that mirror
 * the language of modern job descriptions. The prompt enforces this structure
 * to maximise keyword density without feeling stuffed.
 */
export function buildSummaryPrompt(resumeContext: string, targetRole?: string): string {
  return `You are a professional resume writer specialising in ATS optimisation.

Generate a compelling 3-4 sentence professional summary for a resume.

REQUIREMENTS:
- Open with job title and years of experience
- Mention 3-4 core technical/professional competencies
- Include at least one quantifiable achievement
- Naturally integrate keywords relevant to the target role
- Avoid buzzwords like "passionate", "hardworking", "team player" unless backed by evidence
- Write in third-person omitting pronoun (not "I am" but "Software Engineer with...")
- Keep it between 60-90 words

${targetRole ? `TARGET ROLE: ${targetRole}` : ""}

RESUME CONTEXT:
${resumeContext}

Return ONLY the summary paragraph. No label, no heading, no quotes.`;
}
