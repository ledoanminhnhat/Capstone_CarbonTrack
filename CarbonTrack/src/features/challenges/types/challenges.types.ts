export type MatchType = "SUBCATEGORY" | "CATEGORY";
export type ChallengeStatus = "IN_PROGRESS" | "COMPLETED";

/** Challenge kèm trạng thái của user hiện tại. */
export interface ChallengeView {
  id: string;
  title: string;
  description: string;
  emoji: string;
  points: number;
  target: number;
  joined: boolean;
  progress: number;
  status: ChallengeStatus | null;
  matchType: MatchType;
  matchValue: string;
}

export interface AdminChallenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  points: number;
  matchType: MatchType;
  matchValue: string;
  target: number;
  active: boolean;
}

export interface NewChallenge {
  title: string;
  description: string;
  emoji: string;
  points: number;
  matchType: MatchType;
  matchValue: string;
  target: number;
}
