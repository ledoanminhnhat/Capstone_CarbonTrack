// API challenges
import { authFetch } from "./auth";

export interface ChallengeView {
  id: string;
  title: string;
  description: string;
  emoji: string;
  points: number;
  target: number;
  joined: boolean;
  progress: number;
  status: "IN_PROGRESS" | "COMPLETED" | null;
  matchType: "SUBCATEGORY" | "CATEGORY";
  matchValue: string;
}

export interface AdminChallenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  points: number;
  matchType: "SUBCATEGORY" | "CATEGORY";
  matchValue: string;
  target: number;
  active: boolean;
}

async function readError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message || body.error || `Error ${res.status}`;
  } catch {
    return `Error ${res.status}`;
  }
}

// ----- User -----
export async function getChallenges(): Promise<ChallengeView[]> {
  const res = await authFetch("/api/challenges");
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function joinChallenge(id: string): Promise<void> {
  const res = await authFetch(`/api/challenges/${id}/join`, { method: "POST" });
  if (!res.ok) throw new Error(await readError(res));
}

// ----- Admin -----
export async function getAdminChallenges(): Promise<AdminChallenge[]> {
  const res = await authFetch("/api/admin/challenges");
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function createChallenge(data: {
  title: string;
  description: string;
  emoji: string;
  points: number;
  matchType: "SUBCATEGORY" | "CATEGORY";
  matchValue: string;
  target: number;
}): Promise<AdminChallenge> {
  const res = await authFetch("/api/admin/challenges", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function deleteChallenge(id: string): Promise<void> {
  const res = await authFetch(`/api/admin/challenges/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await readError(res));
}
