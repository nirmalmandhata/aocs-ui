export interface AIAssessment {
  companyName: string;
  industry: string;
  teamSize: number;
  email: string;
  techStack: string[];
  challenges: string[];
  budget: string;
  timeline: string;
  aiReadinessScore?: number;
  createdAt?: string;
  updatedAt?: string;
}
