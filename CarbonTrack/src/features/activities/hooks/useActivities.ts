"use client";

import { useEffect } from "react";
import { useAsync } from "@/hooks/useAsync";
import type { Activity } from "../types";
import { getActivities } from "../services/activity.service";
import { ACTIVITY_LOGGED_EVENT } from "../events";

/** Danh sách activity của user đang đăng nhập; tự tải lại khi có activity mới được log. */
export function useActivities() {
  const { data, loading, error, reload } = useAsync<Activity[]>(getActivities, [], []);

  useEffect(() => {
    const refresh = () => reload({ silent: true });
    window.addEventListener(ACTIVITY_LOGGED_EVENT, refresh);
    return () => window.removeEventListener(ACTIVITY_LOGGED_EVENT, refresh);
  }, [reload]);

  return { activities: data ?? [], loading, error, reload };
}
