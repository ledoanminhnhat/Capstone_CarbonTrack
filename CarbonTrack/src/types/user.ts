import type { Role } from "./auth";

/** Hồ sơ user hiện tại (dùng ở layout, Dashboard, Settings). */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  points: number;
  avatarUrl: string | null;
  yearlyGoalKg: number; // mục tiêu phát thải 1 năm (kg CO2)
}

/** Kiểu ảnh upload lên Cloudinary. */
export type UploadKind = "post" | "avatar";

export interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
  transformation: string;
}
