import type { ChallengeView } from "./types";

export const isCompleted = (c: ChallengeView) => c.status === "COMPLETED";

export const progressPercent = (c: ChallengeView) =>
  c.target > 0 ? Math.min(100, Math.round((c.progress / c.target) * 100)) : 0;

/** Câu mô tả "cái gì được tính". */
export const whatCounts = (c: ChallengeView) =>
  c.matchType === "CATEGORY" ? `Any "${c.matchValue}" activity` : `Logging "${c.matchValue}"`;
