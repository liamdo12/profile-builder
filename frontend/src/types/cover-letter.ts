export interface CoverLetterContent {
  greeting: string;
  paragraphs: string[];
  closing: string;
  signOff: string;
}

export interface CompanyResearch {
  companyName: string;
  companyDomain: string;
  youtubeVideos: string[];
  engineeringBlogs: string[];
  products: string[];
  services: string[];
  techStack: string[];
  summary: string;
}

export interface CoverLetterEvaluation {
  matchPercentage: number;
  verdict: string;
  suggestions: string[];
}

export interface CoverLetterResponse {
  id: number;
  coverLetterContent: CoverLetterContent;
  companyResearch: CompanyResearch;
  evaluation: CoverLetterEvaluation | null;
  createdAt: string;
}
