"use client";

import { useEffect, useState } from "react";
import { FaCloudSun, FaMoon, FaSun } from "react-icons/fa6";
import { formatLongDate, getTimeOfDay, greeting, type TimeOfDay } from "@/utils/date";

/**
 * Lời chào + ngày giờ thời gian thực ở đầu Dashboard.
 * Tách riêng để chỉ component này render lại mỗi giây (không kéo cả trang + biểu đồ render lại).
 */
export default function GreetingClock({ name }: { name?: string }) {
  // Ngày + Giờ thời gian thực + trạng thái buổi + lời chào (chỉ tính ở client)
  const [today, setToday] = useState<{ date: string; time: string; period: TimeOfDay; greet: string }>({
    date: "",
    time: "",
    period: "morning",
    greet: "Hello",
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setToday({
        date: formatLongDate(now),
        time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }),
        period: getTimeOfDay(now),
        greet: greeting(now),
      });
    };
    update();
    const interval = setInterval(update, 1000); // cập nhật mỗi giây
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-2xl md:text-[1.75rem] font-extrabold text-ink m-0 mb-1">
        {today.greet}, <span className="text-gradient-brand">{name || "there"}</span>!
      </h2>
      <div className="flex items-center gap-2.5 text-muted text-[0.875rem] flex-wrap">
        <span>{today.date || " "}</span>
        {today.time && (
          <>
            <span className="w-1 h-1 rounded-full bg-muted/60" />
            {today.period === "morning" && (
              <span className="inline-flex items-center gap-2 font-semibold text-xs px-3 py-1 rounded-lg border text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/40 dark:border-amber-800/50 shadow-sm">
                <FaSun size={15} className="text-amber-500 shrink-0" />
                <span>{today.time}</span>
              </span>
            )}
            {today.period === "noon" && (
              <span className="inline-flex items-center gap-2 font-semibold text-xs px-3 py-1 rounded-lg border text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800/50 shadow-sm">
                <FaSun size={15} className="text-emerald-500 shrink-0" />
                <span>{today.time}</span>
              </span>
            )}
            {today.period === "afternoon" && (
              <span className="inline-flex items-center gap-2 font-semibold text-xs px-3 py-1 rounded-lg border text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-300 dark:bg-orange-950/40 dark:border-orange-800/50 shadow-sm">
                <FaCloudSun size={16} className="text-orange-500 shrink-0" />
                <span>{today.time}</span>
              </span>
            )}
            {today.period === "evening" && (
              <span className="inline-flex items-center gap-2 font-semibold text-xs px-3 py-1 rounded-lg border text-indigo-600 bg-indigo-50 border-indigo-200 dark:text-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-800/50 shadow-sm">
                <FaMoon size={14} className="text-indigo-500 shrink-0" />
                <span>{today.time}</span>
              </span>
            )}
            {today.period === "night" && (
              <span className="inline-flex items-center gap-2 font-semibold text-xs px-3 py-1 rounded-lg border text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-300 dark:bg-purple-950/40 dark:border-purple-800/50 shadow-sm">
                <FaMoon size={14} className="text-purple-400 shrink-0" />
                <span>{today.time}</span>
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
