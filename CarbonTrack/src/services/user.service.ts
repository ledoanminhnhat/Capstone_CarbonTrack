import type { UserProfile } from "@/types";
import { request } from "./http";
import { updateStoredUser } from "./session";

/** Lấy hồ sơ + đồng bộ tên/avatar vào session (vd đổi ở máy khác). */
export async function getProfile(): Promise<UserProfile> {
  const profile = await request<UserProfile>("/api/users/me");
  updateStoredUser({ name: profile.name, avatarUrl: profile.avatarUrl });
  return profile;
}

export async function updateName(name: string): Promise<UserProfile> {
  const profile = await request<UserProfile>("/api/users/me", { method: "PUT", body: { name } });
  updateStoredUser({ name: profile.name });
  return profile;
}

/** Đặt avatar mới (URL Cloudinary) hoặc null để xóa. */
export async function updateAvatar(avatarUrl: string | null): Promise<UserProfile> {
  const profile = await request<UserProfile>("/api/users/me/avatar", { method: "PUT", body: { avatarUrl } });
  updateStoredUser({ avatarUrl: profile.avatarUrl });
  return profile;
}

/** Lưu mục tiêu phát thải 1 năm (kg CO2). */
export const updateTracking = (yearlyGoalKg: number) =>
  request<UserProfile>("/api/users/me/tracking", { method: "PUT", body: { yearlyGoalKg } });

export const changePassword = (currentPassword: string, newPassword: string) =>
  request("/api/users/me/password", { method: "PUT", body: { currentPassword, newPassword } });
