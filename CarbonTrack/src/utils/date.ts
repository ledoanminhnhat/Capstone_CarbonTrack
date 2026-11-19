// Các hàm ngày tháng dùng chung. Backend lưu ngày activity dạng "dd/MM/yyyy",
// nên "month key" thống nhất là "MM/yyyy".

/** "MM/yyyy" của 1 ngày (mặc định hôm nay). */
export function monthKeyOf(d: Date = new Date()): string {
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

/** "dd/MM/yyyy" -> "MM/yyyy" */
export const monthKeyFromDate = (ddMMyyyy: string) => ddMMyyyy.slice(3);

/** Activity date "dd/MM/yyyy" có thuộc tháng "MM/yyyy" không. */
export const isInMonth = (ddMMyyyy: string, monthKey: string) => ddMMyyyy.endsWith(`/${monthKey}`);

/** Sắp xếp "MM/yyyy" mới nhất lên đầu. */
export function compareMonthKeysDesc(a: string, b: string): number {
  const [ma, ya] = a.split("/").map(Number);
  const [mb, yb] = b.split("/").map(Number);
  return yb - ya || mb - ma;
}

/** Danh sách tháng (duy nhất, mới nhất trước) từ danh sách ngày, có thể thêm tháng bắt buộc. */
export function uniqueMonthKeys(dates: string[], include: string[] = []): string[] {
  return Array.from(new Set([...include, ...dates.map(monthKeyFromDate)])).sort(compareMonthKeysDesc);
}

/** "11/2026" -> "November 2026" */
export function monthLabel(monthKey: string): string {
  const [m, y] = monthKey.split("/").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/** Số ngày của tháng "MM/yyyy". */
export function daysInMonth(monthKey: string): number {
  const [m, y] = monthKey.split("/").map(Number);
  return new Date(y, m, 0).getDate();
}

/** "Thursday, 19 November, 2026" */
export function formatLongDate(d: Date = new Date()): string {
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const month = d.toLocaleDateString("en-US", { month: "long" });
  return `${weekday}, ${d.getDate()} ${month}, ${d.getFullYear()}`;
}

/** Lời chào theo giờ. */
export function greeting(d: Date = new Date()): string {
  const h = d.getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

/** "5m ago", "3h ago"… */
export function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-GB");
}

/** "2026-11-19" cho tên file. */
export const isoDate = (d: Date = new Date()) => d.toISOString().slice(0, 10);

/** ISO -> "19 Nov 2026" (null -> "—"). */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
