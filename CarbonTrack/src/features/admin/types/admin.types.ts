import type { Role } from "@/types";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  activityCount: number;
  avatarUrl: string | null;
  points: number;
  createdAt: string | null; // ngày tham gia (account cũ có thể null)
  lastActiveAt: string | null; // lần cuối hoạt động (chấm "đang online")
}

export type RoleFilter = "ALL" | Role;
