"use client";

import { useAsync } from "@/hooks/useAsync";
import type { Activity } from "../types";
import { getActivities } from "../services/activity.service";

/** Danh sách activity của user đang đăng nhập. */
export function useActivities() {
  const { data, loading, error, reload } = useAsync<Activity[]>(getActivities, [], []);
  return { activities: data ?? [], loading, error, reload };
}
