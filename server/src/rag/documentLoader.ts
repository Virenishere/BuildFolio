/**
 * RAG Document Loader
 *
 * Architecture: Converts a resume MongoDB document into a flat list of
 * "ResumeDocument" objects — one per semantic unit (summary, each experience
 * entry, each education entry, skills block, etc.).
 *
 * This mirrors the LangChain Document class intentionally so that swapping
 * to a real LangChain loader (e.g., JSONLoader) requires only changing this
 * file, while all consumers (chains, retriever) remain unchanged.
 *
 * When a vector DB is added, these documents are what gets embedded and
 * upserted — the shape is already compatible with Pinecone/Weaviate metadata.
 */
import { IResume } from "../models/resumeModel";

export interface ResumeDocument {
  id: string;
  section: ResumeSection;
  content: string;
  metadata: Record<string, string>;
}

export type ResumeSection =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "languages"
  | "links"
  | "projects";

export function loadResumeDocuments(resume: IResume): ResumeDocument[] {
  const docs: ResumeDocument[] = [];

  // Personal info — dense string for identity keywords
  docs.push({
    id: `${resume._id?.toString()}-personal`,
    section: "personal",
    content: [
      `Name: ${resume.fullName}`,
      `Email: ${resume.email}`,
      `Phone: ${resume.phone}`,
      resume.address ? `Address: ${resume.address}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    metadata: {
      resumeId: resume._id?.toString() ?? "",
      section: "personal",
    },
  });

  // Summary
  if (resume.summary) {
    docs.push({
      id: `${resume._id?.toString()}-summary`,
      section: "summary",
      content: `Professional Summary:\n${resume.summary}`,
      metadata: {
        resumeId: resume._id?.toString() ?? "",
        section: "summary",
      },
    });
  }

  // Experience — each entry is its own document for granular retrieval
  resume.experience.forEach((exp, i) => {
    docs.push({
      id: `${resume._id?.toString()}-exp-${i}`,
      section: "experience",
      content: [
        `Role: ${exp.title} at ${exp.company}`,
        `Period: ${exp.startDate} to ${exp.endDate}`,
        exp.description ? `Description: ${exp.description}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      metadata: {
        resumeId: resume._id?.toString() ?? "",
        section: "experience",
        company: exp.company,
        role: exp.title,
        index: String(i),
      },
    });
  });

  // Education
  resume.education.forEach((edu, i) => {
    docs.push({
      id: `${resume._id?.toString()}-edu-${i}`,
      section: "education",
      content: [
        `Degree: ${edu.degree} at ${edu.institution}`,
        `Period: ${edu.startDate} to ${edu.endDate}`,
        edu.description ? `Description: ${edu.description}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      metadata: {
        resumeId: resume._id?.toString() ?? "",
        section: "education",
        institution: edu.institution,
        index: String(i),
      },
    });
  });

  // Skills — single document listing all skills
  if (resume.skills && resume.skills.length > 0) {
    docs.push({
      id: `${resume._id?.toString()}-skills`,
      section: "skills",
      content: `Skills: ${resume.skills.join(", ")}`,
      metadata: {
        resumeId: resume._id?.toString() ?? "",
        section: "skills",
      },
    });
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    docs.push({
      id: `${resume._id?.toString()}-certs`,
      section: "certifications",
      content:
        "Certifications:\n" +
        resume.certifications
          .map((c) => `${c.name} — ${c.issuingOrganization} (${c.date})`)
          .join("\n"),
      metadata: {
        resumeId: resume._id?.toString() ?? "",
        section: "certifications",
      },
    });
  }

  // Languages
  if (resume.languages && resume.languages.length > 0) {
    docs.push({
      id: `${resume._id?.toString()}-languages`,
      section: "languages",
      content: `Languages: ${resume.languages.join(", ")}`,
      metadata: {
        resumeId: resume._id?.toString() ?? "",
        section: "languages",
      },
    });
  }

  // Links
  if (resume.links && resume.links.length > 0) {
    docs.push({
      id: `${resume._id?.toString()}-links`,
      section: "links",
      content:
        "Links:\n" + resume.links.map((l) => `${l.label}: ${l.url}`).join("\n"),
      metadata: {
        resumeId: resume._id?.toString() ?? "",
        section: "links",
      },
    });
  }

  return docs;
}
