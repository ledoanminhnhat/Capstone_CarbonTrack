// Gọi API hoạt động (activity). Dùng authFetch để tự đính kèm token.
import { authFetch } from "./auth";

export interface Activity {
  id: string;
  userId: string;
  date: string;     // "dd/MM/yyyy"
  activity: string; // ví dụ "Car", "Red Meat"
  detail: string;   // ví dụ "25 km"
  co2: number;      // kg CO2
  category: string; // Transport / Food / Energy / Shopping
  status: "High" | "Low";
}

// Lấy danh sách hoạt động của người dùng đang đăng nhập
export async function getActivities(): Promise<Activity[]> {
  const res = await authFetch("/api/activities");
  if (!res.ok) throw new Error("Failed to load activities");
  return res.json();
}

// Ghi 1 hoạt động mới (backend tự tính CO2)
export async function logActivity(input: {
  category: string;
  subCategory: string;
  amount: number;
}): Promise<Activity> {
  const res = await authFetch("/api/activities", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to save activity");
  return res.json();
}

// Xóa 1 hoạt động
export async function deleteActivity(id: string): Promise<void> {
  const res = await authFetch(`/api/activities/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete activity");
}
