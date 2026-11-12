// API khu quản trị (chỉ ADMIN dùng được)
import { authFetch } from "./auth";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  activityCount: number;
}

async function readError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message || body.error || `Error ${res.status}`;
  } catch {
    return `Error ${res.status}`;
  }
}

export async function getUsers(): Promise<AdminUser[]> {
  const res = await authFetch("/api/admin/users");
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function changeRole(id: string, role: "USER" | "ADMIN"): Promise<AdminUser> {
  const res = await authFetch(`/api/admin/users/${id}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function deleteUser(id: string): Promise<void> {
  const res = await authFetch(`/api/admin/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await readError(res));
}
