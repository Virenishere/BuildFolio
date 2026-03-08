/**
 * ResumeBuilder page
 *
 * Full resume editor with per-section AI improvement. Each field or section
 * that can be AI-enhanced renders an AIImproveButton + AISuggestionPanel pair.
 *
 * Architecture: Local form state is the source of truth during editing.
 * On save, we PUT /api/resume. AI suggestions update local state when accepted.
 */
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  Link2,
  Plus,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
import { instance } from "@/lib/axios";
import { AIImproveButton } from "@/features/ai/AIImproveButton";
import { AISuggestionPanel } from "@/features/ai/AISuggestionPanel";
import { ATSPanel } from "@/features/ai/ATSPanel";
import { SkillsPanel } from "@/features/ai/SkillsPanel";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Experience {
  _id?: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  _id?: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ResumeForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
  links: { label: string; url: string }[];
}

const emptyForm: ResumeForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  links: [],
};

// ── Helper: Section card wrapper ───────────────────────────────────────────────

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2">
        <span className="text-violet-500">{icon}</span>
        <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full text-sm rounded-lg px-3 py-2",
        "bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700",
        "focus:outline-none focus:ring-2 focus:ring-violet-400",
        "text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
      )}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        "w-full text-sm rounded-lg px-3 py-2 resize-none",
        "bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700",
        "focus:outline-none focus:ring-2 focus:ring-violet-400",
        "text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
      )}
    />
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function ResumeBuilder() {
  const [form, setForm] = useState<ResumeForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");

  useEffect(() => {
    instance
      .get("/api/resume")
      .then((res) => {
        if (res.data.success) {
          const d = res.data.data;
          setForm({
            fullName: d.fullName ?? "",
            email: d.email ?? "",
            phone: d.phone ?? "",
            address: d.address ?? "",
            summary: d.summary ?? "",
            experience: d.experience ?? [],
            education: d.education ?? [],
            skills: Array.isArray(d.skills)
              ? d.skills.map((s: unknown) =>
                  typeof s === "object" && s !== null && "name" in s
                    ? (s as { name: string }).name
                    : String(s)
                )
              : [],
            languages: d.languages ?? [],
            links: d.links ?? [],
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await instance.put("/api/resume", form);
      toast.success("Resume saved successfully");
    } catch {
      toast.error("Failed to save resume");
    } finally {
      setSaving(false);
    }
  }

  function updateField<K extends keyof ResumeForm>(key: K, value: ResumeForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateExp(index: number, key: keyof Experience, value: string) {
    setForm((f) => {
      const exp = [...f.experience];
      exp[index] = { ...exp[index]!, [key]: value };
      return { ...f, experience: exp };
    });
  }

  function addExp() {
    setForm((f) => ({
      ...f,
      experience: [
        ...f.experience,
        { title: "", company: "", startDate: "", endDate: "", description: "" },
      ],
    }));
  }

  function removeExp(index: number) {
    setForm((f) => ({
      ...f,
      experience: f.experience.filter((_, i) => i !== index),
    }));
  }

  function updateEdu(index: number, key: keyof Education, value: string) {
    setForm((f) => {
      const edu = [...f.education];
      edu[index] = { ...edu[index]!, [key]: value };
      return { ...f, education: edu };
    });
  }

  function addEdu() {
    setForm((f) => ({
      ...f,
      education: [
        ...f.education,
        { degree: "", institution: "", startDate: "", endDate: "", description: "" },
      ],
    }));
  }

  function removeEdu(index: number) {
    setForm((f) => ({
      ...f,
      education: f.education.filter((_, i) => i !== index),
    }));
  }

  function addSkill(skill: string) {
    const trimmed = skill.trim();
    if (!trimmed || form.skills.includes(trimmed)) return;
    setForm((f) => ({ ...f, skills: [...f.skills, trimmed] }));
  }

  function removeSkill(skill: string) {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Resume Builder
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Edit your resume and use AI to improve each section
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
            "bg-violet-600 text-white hover:bg-violet-700 transition-colors",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving…" : "Save Resume"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="ats">ATS Optimizer</TabsTrigger>
            <TabsTrigger value="skills">Skill Gaps</TabsTrigger>
          </TabsList>

          {/* ── Editor tab ─────────────────────────────────────────────────── */}
          <TabsContent value="editor" className="space-y-5">
            {/* Personal Info */}
            <SectionCard title="Personal Information" icon={<User className="w-4 h-4" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <TextInput
                    value={form.fullName}
                    onChange={(v) => updateField("fullName", v)}
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Email">
                  <TextInput
                    type="email"
                    value={form.email}
                    onChange={(v) => updateField("email", v)}
                    placeholder="jane@example.com"
                  />
                </Field>
                <Field label="Phone">
                  <TextInput
                    value={form.phone}
                    onChange={(v) => updateField("phone", v)}
                    placeholder="+1 (555) 000-0000"
                  />
                </Field>
                <Field label="Address">
                  <TextInput
                    value={form.address}
                    onChange={(v) => updateField("address", v)}
                    placeholder="San Francisco, CA"
                  />
                </Field>
              </div>
            </SectionCard>

            {/* Summary */}
            <SectionCard title="Professional Summary" icon={<User className="w-4 h-4" />}>
              <Textarea
                value={form.summary}
                onChange={(v) => updateField("summary", v)}
                placeholder="Experienced software engineer with…"
                rows={4}
              />
              <div className="flex items-center gap-2">
                <AIImproveButton
                  id="summary"
                  content={form.summary}
                  type="summary"
                  label="Generate AI Summary"
                />
              </div>
              <AISuggestionPanel
                id="summary"
                onAccept={(v) => updateField("summary", Array.isArray(v) ? v.join(" ") : v)}
              />
            </SectionCard>

            {/* Experience */}
            <SectionCard title="Work Experience" icon={<Briefcase className="w-4 h-4" />}>
              <div className="space-y-6">
                {form.experience.map((exp, i) => {
                  const expId = `exp-${i}`;
                  return (
                    <div
                      key={expId}
                      className="rounded-xl border border-gray-100 dark:border-zinc-800 p-4 space-y-3 relative"
                    >
                      <button
                        onClick={() => removeExp(i)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Job Title">
                          <TextInput
                            value={exp.title}
                            onChange={(v) => updateExp(i, "title", v)}
                            placeholder="Senior Engineer"
                          />
                        </Field>
                        <Field label="Company">
                          <TextInput
                            value={exp.company}
                            onChange={(v) => updateExp(i, "company", v)}
                            placeholder="Acme Corp"
                          />
                        </Field>
                        <Field label="Start Date">
                          <TextInput
                            value={exp.startDate}
                            onChange={(v) => updateExp(i, "startDate", v)}
                            placeholder="Jan 2022"
                          />
                        </Field>
                        <Field label="End Date">
                          <TextInput
                            value={exp.endDate}
                            onChange={(v) => updateExp(i, "endDate", v)}
                            placeholder="Present"
                          />
                        </Field>
                      </div>

                      <Field label="Description">
                        <Textarea
                          value={exp.description}
                          onChange={(v) => updateExp(i, "description", v)}
                          placeholder="Describe your responsibilities and achievements…"
                          rows={3}
                        />
                      </Field>

                      <div className="flex gap-2">
                        <AIImproveButton
                          id={`${expId}-desc`}
                          content={exp.description}
                          type="experience"
                          role={exp.title}
                          company={exp.company}
                          label="Rewrite with AI"
                        />
                      </div>

                      <AISuggestionPanel
                        id={`${expId}-desc`}
                        onAccept={(v) =>
                          updateExp(
                            i,
                            "description",
                            Array.isArray(v) ? v.join("\n") : v
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>

              <button
                onClick={addExp}
                className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            </SectionCard>

            {/* Education */}
            <SectionCard title="Education" icon={<GraduationCap className="w-4 h-4" />}>
              <div className="space-y-5">
                {form.education.map((edu, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-100 dark:border-zinc-800 p-4 space-y-3 relative"
                  >
                    <button
                      onClick={() => removeEdu(i)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Degree">
                        <TextInput
                          value={edu.degree}
                          onChange={(v) => updateEdu(i, "degree", v)}
                          placeholder="B.Sc. Computer Science"
                        />
                      </Field>
                      <Field label="Institution">
                        <TextInput
                          value={edu.institution}
                          onChange={(v) => updateEdu(i, "institution", v)}
                          placeholder="MIT"
                        />
                      </Field>
                      <Field label="Start Date">
                        <TextInput
                          value={edu.startDate}
                          onChange={(v) => updateEdu(i, "startDate", v)}
                          placeholder="Sep 2018"
                        />
                      </Field>
                      <Field label="End Date">
                        <TextInput
                          value={edu.endDate}
                          onChange={(v) => updateEdu(i, "endDate", v)}
                          placeholder="Jun 2022"
                        />
                      </Field>
                    </div>
                    <Field label="Description">
                      <Textarea
                        value={edu.description}
                        onChange={(v) => updateEdu(i, "description", v)}
                        placeholder="GPA, honours, relevant coursework…"
                        rows={2}
                      />
                    </Field>
                  </div>
                ))}
              </div>
              <button
                onClick={addEdu}
                className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </SectionCard>

            {/* Skills */}
            <SectionCard title="Skills" icon={<Wrench className="w-4 h-4" />}>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <SkillInput onAdd={addSkill} />
            </SectionCard>

            {/* Links */}
            <SectionCard title="Links" icon={<Link2 className="w-4 h-4" />}>
              {form.links.map((link, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <TextInput
                    value={link.label}
                    onChange={(v) => {
                      const links = [...form.links];
                      links[i] = { ...links[i]!, label: v };
                      updateField("links", links);
                    }}
                    placeholder="Label (e.g. LinkedIn)"
                  />
                  <TextInput
                    value={link.url}
                    onChange={(v) => {
                      const links = [...form.links];
                      links[i] = { ...links[i]!, url: v };
                      updateField("links", links);
                    }}
                    placeholder="https://…"
                  />
                  <button
                    onClick={() =>
                      updateField(
                        "links",
                        form.links.filter((_, j) => j !== i)
                      )
                    }
                    className="text-gray-400 hover:text-red-500 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  updateField("links", [...form.links, { label: "", url: "" }])
                }
                className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </SectionCard>

            {/* Certifications placeholder */}
            <SectionCard title="Certifications" icon={<Award className="w-4 h-4" />}>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Certifications section — extend the form as needed.
              </p>
            </SectionCard>
          </TabsContent>

          {/* ── ATS tab ────────────────────────────────────────────────────── */}
          <TabsContent value="ats">
            <div className="max-w-2xl rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-6">
              <ATSPanel />
            </div>
          </TabsContent>

          {/* ── Skills tab ─────────────────────────────────────────────────── */}
          <TabsContent value="skills">
            <div className="max-w-2xl rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-6">
              <SkillsPanel onAddSkill={addSkill} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SkillInput({ onAdd }: { onAdd: (skill: string) => void }) {
  const [value, setValue] = useState("");

  function handleKey(e: React.KeyboardEvent) {
    if ((e.key === "Enter" || e.key === ",") && value.trim()) {
      e.preventDefault();
      onAdd(value.trim().replace(/,$/, ""));
      setValue("");
    }
  }

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKey}
      placeholder="Type a skill and press Enter…"
      className={cn(
        "w-full text-sm rounded-lg px-3 py-2",
        "bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700",
        "focus:outline-none focus:ring-2 focus:ring-violet-400",
        "text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
      )}
    />
  );
}
