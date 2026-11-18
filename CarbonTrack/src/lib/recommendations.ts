// API recommendations (gợi ý giảm phát thải)
import { authFetch } from "./auth";

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
  difficulty: "EASY" | "MEDIUM" | "HARD";
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

async function readError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message || body.error || `Error ${res.status}`;
  } catch {
    return `Error ${res.status}`;
  }
}

/** month dạng "MM/yyyy"; bỏ trống = toàn bộ thời gian */
export async function getRecommendations(month?: string): Promise<RecommendationResponse> {
  const q = month ? `?month=${encodeURIComponent(month)}` : "";
  const res = await authFetch(`/api/recommendations${q}`);
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function applyRecommendation(
  id: string
): Promise<{ challengeId: string; title: string }> {
  const res = await authFetch(`/api/recommendations/${id}/apply`, { method: "POST" });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}
