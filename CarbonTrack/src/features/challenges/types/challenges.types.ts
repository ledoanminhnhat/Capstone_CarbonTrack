export type MatchType = "SUBCATEGORY" | "CATEGORY";
export type ChallengeStatus = "IN_PROGRESS" | "COMPLETED";

/** Challenge kèm trạng thái của user hiện tại. */
export interface ChallengeView {
  id: string;
  title: string;
  description: string;
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
  points: number;
  matchType: MatchType;
  matchValue: string;
  target: number;
  active: boolean;
  /** số người đã tham gia */
  participants: number;
  /** số người đã hoàn thành */
  completed: number;
}

export interface NewChallenge {
  title: string;
  description: string;
  points: number;
  matchType: MatchType;
  matchValue: string;
  target: number;
}

/** Admin: 1 người tham gia challenge + tiến độ. */
export interface Participant {
  userId: string;
  name: string;
  avatarUrl: string | null;
  joinedDate: string; // ISO yyyy-MM-dd
  progress: number;
  target: number;
  status: ChallengeStatus;
}
