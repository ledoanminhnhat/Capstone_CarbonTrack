import type { Role } from "@/types";
import type { AdminUser } from "../types";
import { request } from "@/services/http";

export const getUsers = () => request<AdminUser[]>("/api/admin/users");

export const changeRole = (id: string, role: Role) =>
  request<AdminUser>(`/api/admin/users/${id}/role`, { method: "PUT", body: { role } });

export const deleteUser = (id: string) => request(`/api/admin/users/${id}`, { method: "DELETE" });
