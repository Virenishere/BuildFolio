/**
 * Dashboard — the landing page after login.
 *
 * Shows:
 * - Stats strip (resume completeness, AI features used, last edit)
 * - Resume summary card
 * - Quick actions
 * - AI suggestion preview
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Sparkles,
  Target,
  Brain,
  ArrowRight,
  Clock,
  CheckCircle2,
  Loader2,
  Plus,
} from "lucide-react";
import { instance } from "@/lib/axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumePDF from "@/features/resume/Resume";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  summary?: string;
  experience: { title: string; company: string; startDate: string; endDate: string; description?: string }[];
  education: { degree: string; institution: string }[];
  skills: unknown[];
  languages?: string[];
  certifications?: unknown[];
  links?: { label: string; url: string }[];
  updatedAt?: string;
}

// ── Stat card ──────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-5 flex items-start gap-4">
      <div className={cn("rounded-xl p-2.5", color)}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

// ── Quick action button ────────────────────────────────────────────────────────

function QuickAction({
  to,
  icon,
  label,
  description,
  color,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-5 flex items-center gap-4 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
    >
      <div className={cn("rounded-xl p-2.5 flex-shrink-0", color)}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {description}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-violet-500 transition-colors flex-shrink-0" />
    </Link>
  );
}

// ── Completeness calc ──────────────────────────────────────────────────────────

function calcCompleteness(r: ResumeData): number {
  let score = 0;
  if (r.fullName) score += 15;
  if (r.email) score += 10;
  if (r.phone) score += 10;
  if (r.summary) score += 15;
  if (r.experience.length > 0) score += 20;
  if (r.education.length > 0) score += 15;
  if (r.skills.length > 0) score += 15;
  return score;
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instance
      .get("/api/resume")
      .then((res) => {
        if (res.data.success) setResume(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const completeness = resume ? calcCompleteness(resume) : 0;

  const lastEdit = resume?.updatedAt
    ? new Date(resume.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {loading
            ? "Loading…"
            : resume
            ? `Welcome back${resume.fullName ? `, ${resume.fullName.split(" ")[0]}` : ""}! 👋`
            : "Welcome to Buildfolio"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Your AI-powered resume builder dashboard
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : !resume ? (
        /* No resume yet — CTA */
        <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-700 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No resume yet
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Create your first resume and let AI help you polish it.
          </p>
          <Link
            to="/resume-builder"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Resume
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<FileText className="w-5 h-5 text-white" />}
              label="Profile Complete"
              value={`${completeness}%`}
              sub={completeness === 100 ? "All sections filled" : "Keep going!"}
              color="bg-violet-500"
            />
            <StatCard
              icon={<Sparkles className="w-5 h-5 text-white" />}
              label="AI Features"
              value={5}
              sub="Bullet · Summary · ATS · Skills · Exp"
              color="bg-indigo-500"
            />
            <StatCard
              icon={<Target className="w-5 h-5 text-white" />}
              label="Experience"
              value={resume.experience.length}
              sub={`${resume.experience.length === 1 ? "position" : "positions"} listed`}
              color="bg-sky-500"
            />
            <StatCard
              icon={<Clock className="w-5 h-5 text-white" />}
              label="Last Edited"
              value={lastEdit}
              color="bg-emerald-500"
            />
          </div>

          {/* Completeness bar */}
          <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Resume Completeness
              </span>
              <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                {completeness}%
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              {[
                { label: "Personal Info", done: !!(resume.fullName && resume.email && resume.phone) },
                { label: "Summary", done: !!resume.summary },
                { label: "Experience", done: resume.experience.length > 0 },
                { label: "Education", done: resume.education.length > 0 },
                { label: "Skills", done: resume.skills.length > 0 },
              ].map(({ label, done }) => (
                <span
                  key={label}
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-medium",
                    done
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-gray-50 text-gray-500 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                  )}
                >
                  {done ? <CheckCircle2 className="w-3 h-3" /> : null}
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <QuickAction
                to="/resume-builder"
                icon={<FileText className="w-5 h-5 text-violet-600 dark:text-violet-300" />}
                label="Edit Resume"
                description="Update your information and sections"
                color="bg-violet-50 dark:bg-violet-950"
              />
              <QuickAction
                to="/resume-builder?tab=ats"
                icon={<Target className="w-5 h-5 text-sky-600 dark:text-sky-300" />}
                label="ATS Optimizer"
                description="Paste a job description to check your score"
                color="bg-sky-50 dark:bg-sky-950"
              />
              <QuickAction
                to="/resume-builder?tab=skills"
                icon={<Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />}
                label="Skill Gap Analysis"
                description="Discover skills that boost your profile"
                color="bg-emerald-50 dark:bg-emerald-950"
              />
              <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-5 flex items-center gap-4">
                <div className="rounded-xl p-2.5 flex-shrink-0 bg-amber-50 dark:bg-amber-950">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-300" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Download PDF
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Export your resume as a PDF
                  </p>
                </div>
                <PDFDownloadLink
                  document={<ResumePDF data={resume} />}
                  fileName={`${resume.fullName.replace(/\s+/g, "_")}_Resume.pdf`}
                >
                  {({ loading: pdfLoading }) => (
                    <span
                      className={cn(
                        "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
                        pdfLoading
                          ? "bg-gray-100 text-gray-400 cursor-wait"
                          : "bg-violet-600 text-white hover:bg-violet-700 cursor-pointer"
                      )}
                    >
                      {pdfLoading ? "Loading…" : "Export"}
                    </span>
                  )}
                </PDFDownloadLink>
              </div>
            </div>
          </div>

          {/* Resume snippet */}
          <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Resume Preview
              </h2>
              <Link
                to="/resume-builder"
                className="text-xs text-violet-600 dark:text-violet-400 font-medium hover:underline flex items-center gap-1"
              >
                Edit <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-1 text-sm">
              <p className="font-bold text-gray-900 dark:text-white text-lg">
                {resume.fullName}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {resume.email} · {resume.phone}
              </p>
              {resume.summary && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3">
                  {resume.summary}
                </p>
              )}
            </div>

            {resume.experience.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Recent Experience
                </p>
                <div className="space-y-2">
                  {resume.experience.slice(0, 2).map((exp, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {exp.title}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {" "}at {exp.company}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                          {exp.startDate} – {exp.endDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
