import { Injectable } from '@angular/core';
import { AIAssessment } from '../models/ai-assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AIAssessmentService {

  constructor() { }

  /**
   * Calculate AI readiness score based on assessment data
   * Score ranges from 0-100
   */
  calculateReadinessScore(assessment: Omit<AIAssessment, 'aiReadinessScore'>): number {
    let score = 0;

    // Budget weight (max 35 points)
    const budgetScore = this.calculateBudgetScore(assessment.budget);
    score += budgetScore * 0.35;

    // Timeline weight (max 30 points)
    const timelineScore = this.calculateTimelineScore(assessment.timeline);
    score += timelineScore * 0.30;

    // Tech stack presence (max 25 points)
    const techStackScore = this.calculateTechStackScore(assessment.techStack);
    score += techStackScore * 0.25;

    // Challenges complexity (max 10 points)
    const challengesScore = this.calculateChallengesScore(assessment.challenges);
    score += challengesScore * 0.10;

    return Math.round(score);
  }

  /**
   * Calculate budget score (0-100)
   */
  private calculateBudgetScore(budget: string): number {
    const budgetMap: { [key: string]: number } = {
      'under_50k': 30,
      '50k_100k': 50,
      '100k_250k': 70,
      '250k_500k': 85,
      'above_500k': 100
    };
    return budgetMap[budget] || 0;
  }

  /**
   * Calculate timeline score (0-100)
   */
  private calculateTimelineScore(timeline: string): number {
    const timelineMap: { [key: string]: number } = {
      'less_3_months': 30,
      '3_6_months': 60,
      '6_12_months': 85,
      'above_12_months': 100
    };
    return timelineMap[timeline] || 0;
  }

  /**
   * Calculate tech stack presence score (0-100)
   */
  private calculateTechStackScore(techStack: string[]): number {
    if (!techStack || techStack.length === 0) return 10;

    const modernTechs = ['cloud_infrastructure', 'ai_ml_tools', 'api_platforms', 'microservices', 'devops'];
    const matchCount = techStack.filter(tech => modernTechs.includes(tech)).length;

    if (techStack.length === 0) return 10;
    return Math.min(100, (matchCount / techStack.length) * 100);
  }

  /**
   * Calculate challenges score (0-100)
   */
  private calculateChallengesScore(challenges: string[]): number {
    if (!challenges || challenges.length === 0) return 100;

    // Fewer challenges = higher score
    const challengeCount = challenges.length;
    return Math.max(10, 100 - (challengeCount * 15));
  }

  /**
   * Get readiness level text based on score
   */
  getReadinessLevel(score: number): string {
    if (score >= 80) return 'Highly Ready';
    if (score >= 60) return 'Ready';
    if (score >= 40) return 'Emerging';
    return 'Beginner';
  }

  /**
   * Get readiness level color
   */
  getReadinessColor(score: number): string {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#3b82f6'; // blue
    if (score >= 40) return '#f59e0b'; // amber
    return '#ef4444'; // red
  }
}
