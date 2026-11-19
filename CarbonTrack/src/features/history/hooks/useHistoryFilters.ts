"use client";

import { useMemo, useState } from "react";
import type { Activity } from "@/features/activities/types";
import { isInMonth, uniqueMonthKeys } from "@/utils/date";
import { sumCo2 } from "@/utils/emission";

export const ALL = "ALL";

export interface HistoryFilters {
  search: string;
  category: string;
  status: string;
  month: string;
}

/** Bộ lọc + thống kê cho trang History. */
export function useHistoryFilters(activities: Activity[]) {
  const [filters, setFilters] = useState<HistoryFilters>({ search: "", category: ALL, status: ALL, month: ALL });
  const set = <K extends keyof HistoryFilters>(key: K, value: HistoryFilters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase();
    return activities.filter(
      (a) =>
        (a.activity.toLowerCase().includes(q) || a.detail.toLowerCase().includes(q)) &&
        (filters.category === ALL || a.category === filters.category) &&
        (filters.status === ALL || a.status === filters.status) &&
        (filters.month === ALL || isInMonth(a.date, filters.month))
    );
  }, [activities, filters]);

  const monthOptions = useMemo(
    () => [
      { label: "All Time", value: ALL },
      ...uniqueMonthKeys(activities.map((a) => a.date)).map((m) => ({ label: m, value: m })),
    ],
    [activities]
  );

  const total = sumCo2(filtered);
  const stats = {
    total,
    count: filtered.length,
    average: filtered.length ? total / filtered.length : 0,
    highCount: filtered.filter((a) => a.status === "High").length,
  };

  return { filters, set, filtered, monthOptions, stats };
}
