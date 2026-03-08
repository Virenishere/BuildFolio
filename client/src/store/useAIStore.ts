/**
 * AI Store (Zustand)
 *
 * Central state for all AI operations in the app. Each AI feature is tracked
 * independently so multiple "Improve with AI" buttons can operate concurrently
 * without blocking each other.
 *
 * The suggestion map uses a string key (e.g. "bullet-exp-0-1", "summary",
 * "ats") so the UI can look up the suggestion for any field by ID.
 */
import { create } from "zustand";
import { instance } from "@/lib/axios";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AISuggestion {
  id: string;
  type: "bullet" | "summary" | "ats" | "skills" | "experience";
  original: string;
  suggestion: string | string[];
  accepted: boolean;
  loading: boolean;
  error?: string;
}

export interface AtsResult {
  matchScore: number;
  missingKeywords: string[];
  suggestions: string[];
  optimizedSummary: string;
  keywordDensityReport: Record<string, boolean>;
}

export interface SkillsResult {
  technicalSkills: string[];
  softSkills: string[];
  certifications: string[];
  reasoning: string;
}

interface AIState {
  suggestions: Record<string, AISuggestion>;
  globalLoading: boolean;
  atsResult: AtsResult | null;
  skillsResult: SkillsResult | null;

  improveBullet: (
    id: string,
    bullet: string,
    role?: string,
    context?: string
  ) => Promise<void>;

  generateSummary: (targetRole?: string) => Promise<void>;

  atsOptimize: (jobDescription: string) => Promise<void>;

  suggestSkills: (targetRole?: string) => Promise<void>;

  rewriteExperience: (
    id: string,
    description: string,
    role: string,
    company: string
  ) => Promise<void>;

  acceptSuggestion: (id: string) => void;
  dismissSuggestion: (id: string) => void;
  clearSuggestion: (id: string) => void;
}

// ── Store ──────────────────────────────────────────────────────────────────────

export const useAIStore = create<AIState>((set) => ({
  suggestions: {},
  globalLoading: false,
  atsResult: null,
  skillsResult: null,

  async improveBullet(id, bullet, role, context) {
    set((s) => ({
      suggestions: {
        ...s.suggestions,
        [id]: {
          id,
          type: "bullet",
          original: bullet,
          suggestion: "",
          accepted: false,
          loading: true,
        },
      },
    }));
    try {
      const res = await instance.post("/api/ai/improve-bullet", {
        bullet,
        role,
        context,
      });
      const improved: string = res.data.data.improved;
      set((s) => ({
        suggestions: {
          ...s.suggestions,
          [id]: { ...s.suggestions[id]!, loading: false, suggestion: improved },
        },
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "AI error";
      set((s) => ({
        suggestions: {
          ...s.suggestions,
          [id]: { ...s.suggestions[id]!, loading: false, error: message },
        },
      }));
    }
  },

  async generateSummary(targetRole) {
    const id = "summary";
    set((s) => ({
      suggestions: {
        ...s.suggestions,
        [id]: {
          id,
          type: "summary",
          original: "",
          suggestion: "",
          accepted: false,
          loading: true,
        },
      },
    }));
    try {
      const res = await instance.post("/api/ai/generate-summary", {
        targetRole,
      });
      const summary: string = res.data.data.summary;
      set((s) => ({
        suggestions: {
          ...s.suggestions,
          [id]: { ...s.suggestions[id]!, loading: false, suggestion: summary },
        },
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "AI error";
      set((s) => ({
        suggestions: {
          ...s.suggestions,
          [id]: { ...s.suggestions[id]!, loading: false, error: message },
        },
      }));
    }
  },

  async atsOptimize(jobDescription) {
    set({ globalLoading: true, atsResult: null });
    try {
      const res = await instance.post("/api/ai/ats-optimize", {
        jobDescription,
      });
      set({ atsResult: res.data.data as AtsResult, globalLoading: false });
    } catch {
      set({ globalLoading: false });
    }
  },

  async suggestSkills(targetRole) {
    set({ globalLoading: true, skillsResult: null });
    try {
      const res = await instance.post("/api/ai/suggest-skills", { targetRole });
      set({ skillsResult: res.data.data as SkillsResult, globalLoading: false });
    } catch {
      set({ globalLoading: false });
    }
  },

  async rewriteExperience(id, description, role, company) {
    set((s) => ({
      suggestions: {
        ...s.suggestions,
        [id]: {
          id,
          type: "experience",
          original: description,
          suggestion: [],
          accepted: false,
          loading: true,
        },
      },
    }));
    try {
      const res = await instance.post("/api/ai/rewrite-experience", {
        description,
        role,
        company,
      });
      const bullets: string[] = res.data.data.bullets;
      set((s) => ({
        suggestions: {
          ...s.suggestions,
          [id]: {
            ...s.suggestions[id]!,
            loading: false,
            suggestion: bullets,
          },
        },
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "AI error";
      set((s) => ({
        suggestions: {
          ...s.suggestions,
          [id]: { ...s.suggestions[id]!, loading: false, error: message },
        },
      }));
    }
  },

  acceptSuggestion(id) {
    set((s) => ({
      suggestions: {
        ...s.suggestions,
        [id]: { ...s.suggestions[id]!, accepted: true },
      },
    }));
  },

  dismissSuggestion(id) {
    set((s) => {
      const next = { ...s.suggestions };
      delete next[id];
      return { suggestions: next };
    });
  },

  clearSuggestion(id) {
    set((s) => {
      const next = { ...s.suggestions };
      delete next[id];
      return { suggestions: next };
    });
  },
}));
