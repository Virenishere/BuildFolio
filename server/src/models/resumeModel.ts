import { Document, Schema, model } from "mongoose";

export interface IResume extends Document {
  userId: Schema.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  education: {
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
    description?: string;
  }[];
  experience: {
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description?: string;
  }[];
  skills: Schema.Types.ObjectId[]; 
  certifications?: {
    name: string;
    issuingOrganization: string;
    date: string;
  }[];
  languages?: string[];
  links?: {
    label: string;
    url: string;
  }[];
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users", 
      required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    summary: { type: String },
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        description: { type: String },
      },
    ],
    experience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        description: { type: String },
      },
    ],
    skills: [{ type: Schema.Types.ObjectId, ref: "Skills" }],
    certifications: [
      {
        name: { type: String },
        issuingOrganization: { type: String },
        date: { type: String },
      },
    ],
    languages: [{ type: String }],
    links: [
      {
        label: { type: String },
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default model<IResume>("Resumes", resumeSchema);
