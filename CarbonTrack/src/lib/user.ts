// API quản lý tài khoản (trang Settings)
import { authFetch, getUser, saveAuth, getToken } from "./auth";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  points: number;
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
  return res.json();
}

export async function updateName(name: string): Promise<UserProfile> {
  const res = await authFetch("/api/users/me", {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(await readError(res));
  const profile: UserProfile = await res.json();

  // Cập nhật lại tên trong localStorage để sidebar/home hiển thị tên mới
  const token = getToken();
  const current = getUser();
  if (token && current) {
    saveAuth({ token, ...current, name: profile.name });
  }
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
