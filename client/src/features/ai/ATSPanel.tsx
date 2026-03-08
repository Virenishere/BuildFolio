/**
 * ATSPanel — displays ATS match score, keyword analysis, and improvement
 * suggestions after an ats-optimize call.
 */
import { useState } from "react";
import { Target, AlertTriangle, CheckCircle2, Loader2, Zap } from "lucide-react";
import { useAIStore } from "@/store/useAIStore";
import { cn } from "@/lib/utils";

export function ATSPanel() {
  const { atsResult, globalLoading, atsOptimize } = useAIStore();
  const [jd, setJd] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jd.trim()) return;
    setSubmitted(true);
    await atsOptimize(jd.trim());
  }

  const scoreColor =
    atsResult?.matchScore !== undefined
      ? atsResult.matchScore >= 75
        ? "text-emerald-600 dark:text-emerald-400"
        : atsResult.matchScore >= 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400"
      : "";

  const scoreRingColor =
    atsResult?.matchScore !== undefined
      ? atsResult.matchScore >= 75
        ? "stroke-emerald-500"
        : atsResult.matchScore >= 50
        ? "stroke-amber-500"
        : "stroke-red-500"
      : "stroke-gray-300";

  const circumference = 2 * Math.PI * 40;
  const dashOffset =
    atsResult?.matchScore !== undefined
      ? circumference - (atsResult.matchScore / 100) * circumference
      : circumference;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-violet-500" />
          ATS Score Optimizer
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Paste the job description to see how well your resume matches.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the job description here…"
          rows={6}
          className={cn(
            "w-full text-sm rounded-xl px-4 py-3 resize-none",
            "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700",
            "focus:outline-none focus:ring-2 focus:ring-violet-400",
            "text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
          )}
        />
        <button
          type="submit"
          disabled={globalLoading || !jd.trim()}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
            "bg-violet-600 text-white hover:bg-violet-700 transition-colors",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        >
          {globalLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {globalLoading ? "Analysing…" : "Analyse Resume"}
        </button>
      </form>

      {atsResult && submitted && (
        <div className="space-y-5">
          {/* Score ring */}
          <div className="flex items-center gap-6 p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-zinc-700" />
                <circle
                  cx="50" cy="50" r="40" fill="none" strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className={scoreRingColor}
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
              <span className={cn("absolute inset-0 flex items-center justify-center text-xl font-bold", scoreColor)}>
                {atsResult.matchScore}%
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">ATS Match Score</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {atsResult.matchScore >= 75
                  ? "Great match! Your resume is well-optimised for this role."
                  : atsResult.matchScore >= 50
                  ? "Moderate match. Consider the suggestions below."
                  : "Low match. Significant improvements recommended."}
              </p>
            </div>
          </div>

          {/* Missing keywords */}
          {atsResult.missingKeywords.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {atsResult.missingKeywords.map((kw) => (
                  <span key={kw} className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keyword density */}
          {Object.keys(atsResult.keywordDensityReport).length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-violet-500" />
                Keyword Coverage
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(atsResult.keywordDensityReport).map(([kw, present]) => (
                  <span
                    key={kw}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border",
                      present
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                        : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                    )}
                  >
                    {present ? "✓ " : "✗ "}{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {atsResult.suggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Prioritised Improvements
              </h4>
              <ul className="space-y-2">
                {atsResult.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Optimised summary */}
          {atsResult.optimizedSummary && (
            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
              <p className="text-xs font-semibold text-violet-700 dark:text-violet-300 uppercase tracking-wide mb-2">
                ✨ Optimised Summary
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {atsResult.optimizedSummary}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
