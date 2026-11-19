export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface CategoryBreakdown {
  category: string;
  co2: number;
  percent: number;
  topSub: string;
  topSubPercent: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  source: string;
  estimatedSavingKg: number;
  difficulty: Difficulty;
  challengeMatch: string | null;
  challengeTarget: number;
}

export interface RecommendationResponse {
  period: string;
  totalCo2: number;
  totalPotentialSaving: number;
  breakdown: CategoryBreakdown[];
  recommendations: Recommendation[];
}
