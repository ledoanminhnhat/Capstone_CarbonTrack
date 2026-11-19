"use client";

import { useEffect, useState } from "react";
import { FaCloudSun, FaMagnifyingGlass, FaMoon, FaPlus, FaSun, FaSunPlantWilt } from "react-icons/fa6";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatLongDate, getTimeOfDay, greeting, monthKeyOf, type TimeOfDay } from "@/utils/date";
import { useActivities } from "@/features/activities/hooks/useActivities";
import { useDashboardStats } from "@/features/home/hooks/useDashboardStats";
import { useUserGoal } from "@/features/home/hooks/useUserGoal";
import DashboardStats from "@/features/home/components/DashboardStats";
import EmissionTrendChart from "@/features/home/components/EmissionTrendChart";
import EmissionSourcesChart from "@/features/home/components/EmissionSourcesChart";
import RecentActivities from "@/features/home/components/RecentActivities";
import DailyTip from "@/features/home/components/DailyTip";
import LogActivityModal from "@/features/home/components/LogActivityModal";

export default function HomePage() {
  const user = useCurrentUser();
  const goal = useUserGoal();
  const { activities } = useActivities();
  const [chartMonth, setChartMonth] = useState(() => monthKeyOf());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stats = useDashboardStats(activities, chartMonth, goal.monthlyGoalKg);

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
      <header className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-[1.75rem] font-extrabold text-ink m-0 mb-1">
            {today.greet}, <span className="text-gradient-brand">{user?.name || "there"}</span>!
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
        <div className="flex gap-4 items-center w-full sm:w-auto">
          <div className="flex-1 sm:w-[250px]">
            <Input type="text" placeholder="Search" icon={<FaMagnifyingGlass size={16} />} iconPosition="left" />
          </div>
          <div className="hidden sm:block">
            <Button variant="gradient" onClick={() => setIsModalOpen(true)}>
              <FaPlus size={16} className="mr-2" /> Log New Activity
            </Button>
          </div>
        </div>
      </header>

      <DashboardStats
        totalThisMonth={stats.totalThisMonth}
        highestLabel={stats.highestLabel}
        remainingGoal={stats.remainingGoal}
        monthlyGoalKg={goal.monthlyGoalKg}
        yearlyGoalKg={goal.yearlyGoalKg}
        points={goal.points}
      />

      <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6">
        <EmissionTrendChart
          data={stats.lineData}
          monthLabel={stats.chartMonthLabel}
          month={chartMonth}
          monthOptions={stats.monthOptions}
          onMonthChange={setChartMonth}
          dailyGoalKg={goal.monthlyGoalKg / 30}
        />
        <EmissionSourcesChart data={stats.pieData} monthLabel={stats.chartMonthLabel} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <RecentActivities activities={stats.recent} />
        <DailyTip />
      </section>

      <LogActivityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
