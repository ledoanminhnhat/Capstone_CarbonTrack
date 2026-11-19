// "Đang online" = có gọi API trong vòng ONLINE_WINDOW_MS (backend ghi lastActiveAt tối đa 1 lần/phút).
export const ONLINE_WINDOW_MS = 5 * 60 * 1000;

export function isOnline(lastActiveAt: string | null | undefined, now = Date.now()): boolean {
  return !!lastActiveAt && now - new Date(lastActiveAt).getTime() < ONLINE_WINDOW_MS;
}

/** "Online now" / "Active 12m ago" / "Active 3h ago" / "Active 2d ago" / "Never active". */
export function lastActiveLabel(lastActiveAt: string | null | undefined, now = Date.now()): string {
  if (!lastActiveAt) return "Never active";
  if (isOnline(lastActiveAt, now)) return "Online now";
  const min = Math.floor((now - new Date(lastActiveAt).getTime()) / 60000);
  if (min < 60) return `Active ${min}m ago`;
  if (min < 1440) return `Active ${Math.floor(min / 60)}h ago`;
  return `Active ${Math.floor(min / 1440)}d ago`;
}
