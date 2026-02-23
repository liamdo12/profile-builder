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

export interface RecommendationItem {
  section: string;       // EXPERIENCE, SKILLS, PROJECTS, EDUCATION
  entryIndex: number | null;
  bulletIndex: number | null;
  type: 'modify' | 'add' | 'remove';
  original: string | null;
  suggested: string;
  reason: string;
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
  recommendations: RecommendationItem[];
}

export interface SmartGeneratedResumeResponse {
  id: number;
  resumeContent: SmartResumeContent;
  validation: HrValidationResponse | null;
  createdAt: string;
}

export interface ApplyRecommendationsRequest {
  recommendations: RecommendationItem[];
}
