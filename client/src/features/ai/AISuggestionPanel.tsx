/**
 * AISuggestionPanel — renders the suggestion card that appears below any field
 * after "Improve with AI" has been clicked.
 *
 * User flow:
 *  1. Loading spinner while Gemini is generating
 *  2. Suggestion card with the improved text (or bullet list)
 *  3. Accept → onAccept(suggestion) is called, card is dismissed
 *  4. Edit → textarea pre-filled with suggestion opens, user can tweak
 *  5. Dismiss → card is removed from store
 */
import { useState } from "react";
import { Check, X, Pencil, Loader2, AlertCircle } from "lucide-react";
import { useAIStore, AISuggestion } from "@/store/useAIStore";
import { cn } from "@/lib/utils";

interface AISuggestionPanelProps {
  id: string;
  onAccept: (value: string | string[]) => void;
}

export function AISuggestionPanel({ id, onAccept }: AISuggestionPanelProps) {
  const { suggestions, acceptSuggestion, dismissSuggestion } = useAIStore();
  const suggestion: AISuggestion | undefined = suggestions[id];

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  if (!suggestion) return null;

  const { loading, error, suggestion: value, accepted } = suggestion;

  if (loading) {
    return (
      <div className="mt-2 flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>AI is generating a suggestion…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{error}</span>
        <button
          onClick={() => dismissSuggestion(id)}
          className="ml-auto hover:opacity-70"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  if (accepted) return null;

  function handleAccept() {
    const finalValue = editing ? editValue : value;
    onAccept(finalValue);
    acceptSuggestion(id);
  }

  function handleStartEdit() {
    const initialValue = Array.isArray(value) ? value.join("\n") : value;
    setEditValue(initialValue);
    setEditing(true);
  }

  return (
    <div
      className={cn(
        "mt-2 rounded-xl border border-violet-200 dark:border-violet-800",
        "bg-violet-50/50 dark:bg-violet-950/30 p-3 space-y-2"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-violet-700 dark:text-violet-300 uppercase tracking-wide">
          ✨ AI Suggestion
        </span>
        <button
          onClick={() => dismissSuggestion(id)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {editing ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          rows={4}
          className={cn(
            "w-full text-sm rounded-lg px-3 py-2 resize-none",
            "bg-white dark:bg-zinc-900 border border-violet-300 dark:border-violet-700",
            "focus:outline-none focus:ring-2 focus:ring-violet-400",
            "text-gray-800 dark:text-gray-200"
          )}
        />
      ) : Array.isArray(value) ? (
        <ul className="space-y-1">
          {value.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-violet-400 mt-0.5">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {value}
        </p>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleAccept}
          className={cn(
            "inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium",
            "bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800 transition-colors"
          )}
        >
          <Check className="w-3.5 h-3.5" />
          Accept
        </button>

        {!editing && (
          <button
            onClick={handleStartEdit}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium",
              "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300",
              "border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
            )}
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        )}

        {editing && (
          <button
            onClick={() => setEditing(false)}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium",
              "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300",
              "border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 transition-colors"
            )}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
