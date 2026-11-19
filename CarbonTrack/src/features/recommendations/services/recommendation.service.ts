import type { RecommendationResponse } from "../types";
import { query, request } from "@/services/http";

/** month dạng "MM/yyyy"; bỏ trống = toàn bộ thời gian */
export const getRecommendations = (month?: string) =>
  request<RecommendationResponse>(`/api/recommendations${query({ month })}`);

/** Biến 1 gợi ý thành challenge và tham gia. */
export const applyRecommendation = (id: string) =>
  request<{ challengeId: string; title: string }>(`/api/recommendations/${id}/apply`, { method: "POST" });
