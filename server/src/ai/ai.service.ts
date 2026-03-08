/**
 * AI Service — the single orchestration layer between HTTP controllers and chains.
 *
 * Architecture: Controllers are intentionally thin — they only handle HTTP
 * concerns (parsing body, sending response, error codes). All business logic
 * lives here. This keeps chains independently testable and allows future
 * batching, caching, or telemetry to be added in one place.
 */
import Resume, { IResume } from "../models/resumeModel";
import { improveBulletChain } from "./chains/improveBullet.chain";
import { resumeSummaryChain } from "./chains/resumeSummary.chain";
import {
  atsOptimizationChain,
  suggestSkillsChain,
  rewriteExperienceChain,
  AtsOptimizationResult,
  SuggestSkillsOutput,
  RewriteExperienceOutput,
} from "./chains/atsOptimization.chain";
import { ImproveBulletOutput } from "./chains/improveBullet.chain";

export interface ImproveBulletRequest {
  bullet: string;
  role?: string;
  context?: string;
}

export interface GenerateSummaryRequest {
  userId: string;
  targetRole?: string;
}

export interface AtsOptimizeRequest {
  userId: string;
  jobDescription: string;
}

export interface SuggestSkillsRequest {
  userId: string;
  targetRole?: string;
}

export interface RewriteExperienceRequest {
  description: string;
  role: string;
  company: string;
}

async function findResume(userId: string): Promise<IResume> {
  const resume = await Resume.findOne({ userId }).populate("skills").lean();
  if (!resume) {
    throw Object.assign(new Error("Resume not found for this user"), {
      statusCode: 404,
    });
  }
  return resume as unknown as IResume;
}

export const aiService = {
  async improveBullet(req: ImproveBulletRequest): Promise<ImproveBulletOutput> {
    if (!req.bullet?.trim()) {
      throw Object.assign(new Error("bullet is required"), { statusCode: 400 });
    }
    return improveBulletChain({
      bullet: req.bullet.trim(),
      role: req.role,
      context: req.context,
    });
  },

  async generateSummary(req: GenerateSummaryRequest): Promise<{ summary: string }> {
    const resume = await findResume(req.userId);
    const result = await resumeSummaryChain({
      resume,
      targetRole: req.targetRole,
    });
    return { summary: result.summary };
  },

  async atsOptimize(req: AtsOptimizeRequest): Promise<AtsOptimizationResult> {
    if (!req.jobDescription?.trim()) {
      throw Object.assign(new Error("jobDescription is required"), {
        statusCode: 400,
      });
    }
    const resume = await findResume(req.userId);
    return atsOptimizationChain({ resume, jobDescription: req.jobDescription });
  },

  async suggestSkills(req: SuggestSkillsRequest): Promise<SuggestSkillsOutput> {
    const resume = await findResume(req.userId);
    return suggestSkillsChain({ resume, targetRole: req.targetRole });
  },

  async rewriteExperience(
    req: RewriteExperienceRequest
  ): Promise<RewriteExperienceOutput> {
    if (!req.description?.trim()) {
      throw Object.assign(new Error("description is required"), {
        statusCode: 400,
      });
    }
    if (!req.role?.trim() || !req.company?.trim()) {
      throw Object.assign(new Error("role and company are required"), {
        statusCode: 400,
      });
    }
    return rewriteExperienceChain({
      description: req.description,
      role: req.role,
      company: req.company,
    });
  },
};
