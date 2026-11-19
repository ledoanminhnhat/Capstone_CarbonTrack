import type { AdminChallenge, ChallengeView, NewChallenge } from "../types";
import { request } from "@/services/http";

// ----- User -----
export const getChallenges = () => request<ChallengeView[]>("/api/challenges");

export const joinChallenge = (id: string) => request(`/api/challenges/${id}/join`, { method: "POST" });

// ----- Admin -----
export const getAdminChallenges = () => request<AdminChallenge[]>("/api/admin/challenges");

export const createChallenge = (data: NewChallenge) =>
  request<AdminChallenge>("/api/admin/challenges", { method: "POST", body: data });

export const deleteChallenge = (id: string) => request(`/api/admin/challenges/${id}`, { method: "DELETE" });
