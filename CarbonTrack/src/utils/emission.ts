import type { Activity } from "@/features/activities/types";

/** Làm tròn 1 hoặc 2 chữ số thập phân. */
export const round1 = (n: number) => Math.round(n * 10) / 10;
export const round2 = (n: number) => Math.round(n * 100) / 100;

/** Phần trăm (0 nếu tổng = 0). */
export const percent = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

/** Mục tiêu tháng = mục tiêu năm / 12. */
export const monthlyGoalOf = (yearlyKg: number) => yearlyKg / 12;

/** Tổng CO2 của danh sách activity. */
export const sumCo2 = (list: Activity[]) => list.reduce((s, a) => s + a.co2, 0);

/** CO2 theo một khóa (category, ngày…). */
export function sumCo2By(list: Activity[], key: (a: Activity) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const a of list) {
    const k = key(a);
    out[k] = (out[k] ?? 0) + a.co2;
  }
  return out;
}
