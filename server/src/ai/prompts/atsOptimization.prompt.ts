/**
 * Prompt templates for ATS optimization and supporting AI features.
 *
 * Design principle: The ATS optimization chain is the highest-value feature —
 * it compares the resume against a real job description and produces a gap
 * analysis plus an improved resume. The structured JSON output makes it easy
 * to render in the UI without brittle parsing.
 */

export interface AtsOptimizationResult {
  matchScore: number;
  missingKeywords: string[];
  suggestions: string[];
  optimizedSummary: string;
  keywordDensityReport: Record<string, boolean>;
}

export function buildAtsOptimizationPrompt(
  resumeContext: string,
  jobDescription: string
): string {
  return `You are an ATS (Applicant Tracking System) expert and senior recruiter.

Analyse the resume against the job description and return a JSON object with this exact shape:
{
  "matchScore": <number 0-100>,
  "missingKeywords": ["keyword1", "keyword2", ...],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", ...],
  "optimizedSummary": "<rewritten summary optimised for this JD>",
  "keywordDensityReport": { "keyword": true/false, ... }
}

SCORING CRITERIA:
- matchScore: percentage of critical JD keywords present in the resume
- missingKeywords: important terms from JD absent in the resume
- suggestions: 3-6 concrete, prioritised improvements (most impactful first)
- optimizedSummary: new summary that mirrors JD language naturally
- keywordDensityReport: top 10 JD keywords mapped to whether they appear in the resume

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeContext}

Respond ONLY with valid JSON matching the schema above.`;
}

export function buildSuggestSkillsPrompt(
  resumeContext: string,
  targetRole?: string
): string {
  return `You are a senior technical recruiter and career advisor.

Analyse this resume and suggest missing skills that would significantly improve the candidate's chances.

Return a JSON object with this shape:
{
  "technicalSkills": ["skill1", "skill2", ...],
  "softSkills": ["skill1", "skill2", ...],
  "certifications": ["cert1", "cert2", ...],
  "reasoning": "Brief explanation of why these skills are recommended"
}

CRITERIA:
- Focus on skills that appear in 60%+ of job postings for this role
- Prioritise skills that complement existing ones on the resume
- Include both current and emerging technologies for the field
- Suggest at most 5 items per category

${targetRole ? `TARGET ROLE: ${targetRole}` : ""}

RESUME:
${resumeContext}

Respond ONLY with valid JSON matching the schema above.`;
}

export function buildRewriteExperiencePrompt(
  experienceDescription: string,
  role: string,
  company: string
): string {
  return `You are an expert resume writer specialising in experience sections.

Rewrite this job experience description as 3-5 polished bullet points.

REQUIREMENTS:
- Each bullet starts with a strong past-tense action verb
- Include metrics/numbers where inferable or suggest placeholders like [X%] or [$Y]
- Mirror language used in modern ${role} job descriptions
- Ensure ATS compatibility — avoid tables, special characters, graphics references
- Each bullet must be self-contained (no references to "as mentioned above")

ROLE: ${role}
COMPANY: ${company}

ORIGINAL DESCRIPTION:
${experienceDescription}

Return ONLY the bullet points, one per line, each starting with "• ". No headers, no extra text.`;
}
