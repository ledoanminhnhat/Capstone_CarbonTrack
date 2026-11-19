"use client";

import { useEffect, useState } from "react";
import { MdSearch, MdAdd } from "react-icons/md";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatLongDate, greeting, monthKeyOf } from "@/utils/date";
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
  const { activities, reload } = useActivities();
  const [chartMonth, setChartMonth] = useState(() => monthKeyOf());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stats = useDashboardStats(activities, chartMonth, goal.monthlyGoalKg);

  // Ngày + lời chào chỉ tính ở client (tránh lệch giờ server)
  const [today, setToday] = useState({ date: "", greet: "Hello" });
  useEffect(() => setToday({ date: formatLongDate(), greet: greeting() }), []);

  return (
    <div>
      <header className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <h2 className="text-[1.75rem] font-extrabold text-ink m-0 mb-1">
            {today.greet}, <span className="text-gradient-brand">{user?.name || "there"}</span>!
          </h2>
          <p className="text-muted m-0 text-[0.9rem]">{today.date || " "}</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-[250px]">
            <Input type="text" placeholder="Search" icon={<MdSearch size={20} />} iconPosition="left" />
          </div>
          <Button variant="gradient" onClick={() => setIsModalOpen(true)}>
            <MdAdd size={20} className="mr-2" /> Log New Activity
          </Button>
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

      <LogActivityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSaved={reload} />
    </div>
  );
}
