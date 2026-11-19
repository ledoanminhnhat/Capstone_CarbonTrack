// API quản lý tài khoản (trang Settings)
import { authFetch, updateStoredUser } from "./auth";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  points: number;
  avatarUrl: string | null;
}

async function readError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message || body.error || `Error ${res.status}`;
  } catch {
    return `Error ${res.status}`;
  }
}

export async function getProfile(): Promise<UserProfile> {
  const res = await authFetch("/api/users/me");
  if (!res.ok) throw new Error(await readError(res));
  const profile: UserProfile = await res.json();
  // đồng bộ avatar/tên đang lưu (vd đổi ở máy khác)
  updateStoredUser({ name: profile.name, avatarUrl: profile.avatarUrl });
  return profile;
}

export async function updateName(name: string): Promise<UserProfile> {
  const res = await authFetch("/api/users/me", {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(await readError(res));
  const profile: UserProfile = await res.json();
  // Cập nhật tên đang lưu để sidebar hiển thị ngay
  updateStoredUser({ name: profile.name });
  return profile;
}

/** Đặt avatar mới (URL Cloudinary) hoặc null để xóa. */
export async function updateAvatar(avatarUrl: string | null): Promise<UserProfile> {
  const res = await authFetch("/api/users/me/avatar", {
    method: "PUT",
    body: JSON.stringify({ avatarUrl }),
  });
  if (!res.ok) throw new Error(await readError(res));
  const profile: UserProfile = await res.json();
  updateStoredUser({ avatarUrl: profile.avatarUrl });
  return profile;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const res = await authFetch("/api/users/me/password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) throw new Error(await readError(res));
}
