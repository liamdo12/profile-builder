export interface SmartResumePersonalInfo {
  fullName: string;
  location: string;
  phone: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
}

export interface SmartResumeSectionEntry {
  title: string;
  subtitle: string;
  location: string;
  dateRange: string;
  bullets: string[];
}

export interface SmartResumeSection {
  sectionName: string;
  entries: SmartResumeSectionEntry[];
}

export interface SmartResumeContent {
  personalInfo: SmartResumePersonalInfo | null;
  sections: SmartResumeSection[];
}

export interface HrValidationResponse {
  overallScore: number;
  keywordMatchScore: number;
  experienceRelevanceScore: number;
  skillsAlignmentScore: number;
  resumeQualityScore: number;
  educationFitScore: number;
  gaps: string[];
  strengths: string[];
  recommendations: string[];
}

export interface SmartGeneratedResumeResponse {
  id: number;
  resumeContent: SmartResumeContent;
  validation: HrValidationResponse | null;
  createdAt: string;
}
