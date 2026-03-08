/**
 * SkillsPanel — shows AI-suggested missing skills categorised by type.
 */
import { useState } from "react";
import { Brain, Loader2, Plus } from "lucide-react";
import { useAIStore } from "@/store/useAIStore";
import { cn } from "@/lib/utils";

interface SkillsPanelProps {
  onAddSkill?: (skill: string) => void;
}

export function SkillsPanel({ onAddSkill }: SkillsPanelProps) {
  const { skillsResult, globalLoading, suggestSkills } = useAIStore();
  const [targetRole, setTargetRole] = useState("");

  async function handleSuggest() {
    await suggestSkills(targetRole.trim() || undefined);
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-violet-500" />
          Skill Gap Analysis
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          AI analyses your resume and suggests high-value missing skills.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="Target role (optional, e.g. Senior Engineer)"
          className={cn(
            "flex-1 text-sm rounded-lg px-3 py-2",
            "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700",
            "focus:outline-none focus:ring-2 focus:ring-violet-400",
            "text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
          )}
        />
        <button
          onClick={handleSuggest}
          disabled={globalLoading}
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium",
            "bg-violet-600 text-white hover:bg-violet-700 transition-colors",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        >
          {globalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {globalLoading ? "Analysing…" : "Suggest Skills"}
        </button>
      </div>

      {skillsResult && (
        <div className="space-y-4">
          {skillsResult.technicalSkills.length > 0 && (
            <SkillCategory
              title="Technical Skills"
              skills={skillsResult.technicalSkills}
              color="blue"
              onAddSkill={onAddSkill}
            />
          )}
          {skillsResult.softSkills.length > 0 && (
            <SkillCategory
              title="Soft Skills"
              skills={skillsResult.softSkills}
              color="emerald"
              onAddSkill={onAddSkill}
            />
          )}
          {skillsResult.certifications.length > 0 && (
            <SkillCategory
              title="Recommended Certifications"
              skills={skillsResult.certifications}
              color="amber"
              onAddSkill={onAddSkill}
            />
          )}
          {skillsResult.reasoning && (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              {skillsResult.reasoning}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface SkillCategoryProps {
  title: string;
  skills: string[];
  color: "blue" | "emerald" | "amber";
  onAddSkill?: (skill: string) => void;
}

const colorMap = {
  blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
};

function SkillCategory({ title, skills, color, onAddSkill }: SkillCategoryProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div key={skill} className={cn("flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border", colorMap[color])}>
            <span>{skill}</span>
            {onAddSkill && (
              <button
                onClick={() => onAddSkill(skill)}
                className="ml-1 hover:opacity-70 transition-opacity"
                title="Add to resume"
              >
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
