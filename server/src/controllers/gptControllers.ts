import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import axios from "axios";
import Resume from "../models/resumeModel";

// AuthRequest type
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    userName: string;
  };
}

interface ResumeSection {
  [key: string]: string;
}

interface ApiError {
  message: string;
}

// Add this interface for the Python API response
interface PythonApiResponse {
  generated_text: string;
}

dotenv.config();

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

export const gptController = {
  async enhanceResume(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
      }

      const userId = user.id;
      const { prompt } = req.body;

      if (!prompt) {
        res.status(400).json({ success: false, message: "Prompt is required" });
        return;
      }

      const resume = await Resume.findOne({ userId });
      if (!resume) {
        res.status(404).json({ success: false, message: "Resume not found" });
        return;
      }

      // Helper function to safely handle optional arrays
      const formatOptionalArray = <T>(arr: T[] | undefined, formatter: (item: T) => string, fallback = 'None listed'): string => {
        return arr && arr.length > 0 ? arr.map(formatter).join('') : fallback;
      };

      // Structure the resume data more clearly for the AI
      const resumeData = `
        RESUME DETAILS TO ENHANCE:
        
        PERSONAL INFORMATION:
        - Name: ${resume.fullName}
        - Email: ${resume.email}
        - Phone: ${resume.phone}
        - Address: ${resume.address || 'Not specified'}
        
        SUMMARY:
        ${resume.summary || 'Not specified'}
        
        EDUCATION:
        ${resume.education.map(edu => `
        - Degree: ${edu.degree}
          Institution: ${edu.institution}
          Dates: ${edu.startDate} to ${edu.endDate}
          Description: ${edu.description || 'N/A'}
        `).join('')}
        
        EXPERIENCE:
        ${resume.experience.map(exp => `
        - Title: ${exp.title}
          Company: ${exp.company}
          Dates: ${exp.startDate} to ${exp.endDate}
          Description: ${exp.description || 'N/A'}
        `).join('')}
        
        SKILLS:
        ${resume.skills.length > 0 ? resume.skills.join(', ') : 'None listed'}
        
        CERTIFICATIONS:
        ${formatOptionalArray(resume.certifications, cert => `
          - ${cert.name} from ${cert.issuingOrganization} (${cert.date})
        `)}
        
        LANGUAGES:
        ${resume.languages ? resume.languages.join(', ') : 'None listed'}
        
        LINKS:
        ${formatOptionalArray(resume.links, link => `- ${link.label}: ${link.url}\n`)}
      `;

      // Create a more specific instruction for the AI
      const instruction = `
        You are a professional resume enhancement assistant. Below is the user's current resume data and their specific request for enhancement.
        
        USER'S REQUEST:
        ${prompt}
        
        Please provide an enhanced version of their resume based on their request and professional best practices. Focus on:
        - Improving clarity and impact of the summary
        - Strengthening job descriptions with action verbs and measurable results
        - Ensuring consistent formatting
        - Highlighting relevant skills and achievements
        - Maintaining a professional tone
        
        Return ONLY the enhanced content, not the original.
      `;

      // Call Python backend API using Axios with proper typing
      const response = await axios.post<PythonApiResponse>(`${PYTHON_API_URL}/generate`, {
        prompt: `${resumeData}\n\n${instruction}`
      });

      // console.log(response)
      const enhancedText = response.data.generated_text || "No response generated";
      // console.log(enhancedText)

      res.status(200).json({
        success: true,
        data: {
          original: resumeData,
          enhanced: enhancedText,
        },
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("API error:", apiError.message);
      res.status(500).json({
        success: false,
        message: "AI service error",
        details: apiError.message,
      });
    }
  },

  async generateResumeContent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt, template } = req.body;

      if (!prompt) {
        res.status(400).json({ success: false, message: "Prompt is required" });
        return;
      }

      const inputText = `Generate professional resume content:
        Template style: ${template || "standard"}
        User prompt: ${prompt}`;

      // Call Python backend API using Axios with proper typing
      const response = await axios.post<PythonApiResponse>(`${PYTHON_API_URL}/generate`, {
        prompt: inputText
      });

      const generatedContent = response.data.generated_text || "No response generated";
      const sections = this.parseGeneratedContent(generatedContent);

      res.status(200).json({
        success: true,
        data: sections,
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("API error:", apiError.message);
      res.status(500).json({
        success: false,
        message: "AI service error",
        details: apiError.message,
      });
    }
  },

  parseGeneratedContent(content: string): ResumeSection {
    const sections: ResumeSection = {};
    const sectionRegex = /(Summary|Experience|Education|Skills):\s*(.*?)(?=\n\w+:|$)/gs;
    let match;
    while ((match = sectionRegex.exec(content)) !== null) {
      if (match[1] && match[2]) {
        sections[match[1]] = match[2].trim();
      }
    }
    return sections;
  },
};