"use client";

import { useMemo } from "react";
import type { Activity } from "@/features/activities/types";
import { categoryColor } from "@/constants/categories";
import { daysInMonth, isInMonth, monthKeyOf, monthLabel, uniqueMonthKeys } from "@/utils/date";
import { percent, round1, sumCo2, sumCo2By } from "@/utils/emission";

export interface PieSlice {
  name: string;
  value: number; // %
  co2: number;
  color: string;
}

/** Số liệu Dashboard: thẻ thống kê theo tháng hiện tại, biểu đồ theo tháng đang chọn. */
export function useDashboardStats(activities: Activity[], chartMonth: string, monthlyGoalKg: number) {
  return useMemo(() => {
    const currentMonth = monthKeyOf();

    // ----- Thẻ thống kê: luôn theo tháng hiện tại -----
    const monthly = activities.filter((a) => isInMonth(a.date, currentMonth));
    const totalThisMonth = sumCo2(monthly);
    const highest = Object.entries(sumCo2By(monthly, (a) => a.category)).sort((a, b) => b[1] - a[1])[0];
    const highestLabel = highest ? `${highest[0]} (${percent(highest[1], totalThisMonth)}%)` : "—";
    // dương = còn lại, âm = đã vượt mục tiêu
    const remainingGoal = monthlyGoalKg - totalThisMonth;

    // ----- Dropdown tháng: tháng hiện tại + các tháng có dữ liệu -----
    const monthOptions = uniqueMonthKeys(
      activities.map((a) => a.date),
      [currentMonth]
    ).map((m) => ({ label: m, value: m }));

    // ----- Biểu đồ: theo tháng được chọn -----
    const selected = activities.filter((a) => isInMonth(a.date, chartMonth));
    const totalSelected = sumCo2(selected);
    const pieData: PieSlice[] = Object.entries(sumCo2By(selected, (a) => a.category)).map(([name, co2]) => ({
      name,
      value: percent(co2, totalSelected),
      co2: round1(co2),
      color: categoryColor(name),
    }));

    const byDay = sumCo2By(selected, (a) => a.date.slice(0, 2));
    // tháng hiện tại: tới hôm nay; tháng cũ: đủ số ngày của tháng
    const lastDay = chartMonth === currentMonth ? new Date().getDate() : daysInMonth(chartMonth);
    const lineData = Array.from({ length: lastDay }, (_, i) => {
      const key = String(i + 1).padStart(2, "0");
      return { name: String(i + 1), value: round1(byDay[key] ?? 0) };
    });

    return {
      totalThisMonth,
      highestLabel,
      remainingGoal,
      monthOptions,
      pieData,
      lineData,
      chartMonthLabel: monthLabel(chartMonth),
      recent: activities.slice(0, 3),
    };
  }, [activities, chartMonth, monthlyGoalKg]);
}
