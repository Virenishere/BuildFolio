/**
 * AIImproveButton — a self-contained "✨ Improve with AI" trigger.
 *
 * Props:
 *  - id: unique key for the suggestion in the AI store
 *  - content: the text content to improve
 *  - type: what kind of improvement to request
 *  - role/company: optional context for experience rewrites
 *  - className: forwarded to the button for layout control
 *
 * The button reads its own loading state from the store, so multiple buttons
 * on the same page are independent.
 */
import { Sparkles, Loader2 } from "lucide-react";
import { useAIStore } from "@/store/useAIStore";
import { cn } from "@/lib/utils";

interface AIImproveButtonProps {
  id: string;
  content: string;
  type: "bullet" | "summary" | "experience";
  role?: string;
  company?: string;
  className?: string;
  label?: string;
}

export function AIImproveButton({
  id,
  content,
  type,
  role,
  company,
  className,
  label = "Improve with AI",
}: AIImproveButtonProps) {
  const { suggestions, improveBullet, generateSummary, rewriteExperience } =
    useAIStore();

  const suggestion = suggestions[id];
  const isLoading = suggestion?.loading ?? false;

  async function handleClick() {
    if (isLoading) return;
    if (type === "bullet") {
      await improveBullet(id, content, role);
    } else if (type === "summary") {
      await generateSummary(role);
    } else if (type === "experience") {
      await rewriteExperience(id, content, role ?? "", company ?? "");
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md",
        "bg-violet-50 text-violet-700 border border-violet-200",
        "hover:bg-violet-100 active:bg-violet-200 transition-colors",
        "dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
        "dark:hover:bg-violet-900",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      <span>{isLoading ? "Generating…" : label}</span>
    </button>
  );
}
