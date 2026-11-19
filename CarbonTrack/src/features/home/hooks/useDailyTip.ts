"use client";

import { useEffect, useState } from "react";
import { DAILY_TIPS } from "../constants/dailyTips";

/** Thứ tự ngày trong năm (0..365). */
function dayOfYear(d = new Date()): number {
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86_400_000);
}

/** Mẹo của hôm nay (đổi mỗi ngày) + xem mẹo kế tiếp. */
export function useDailyTip() {
  const [index, setIndex] = useState(0);

  // tính ở client để khớp ngày theo máy người dùng
  useEffect(() => setIndex(dayOfYear() % DAILY_TIPS.length), []);

  return {
    tip: DAILY_TIPS[index],
    position: index + 1,
    total: DAILY_TIPS.length,
    next: () => setIndex((i) => (i + 1) % DAILY_TIPS.length),
  };
}
