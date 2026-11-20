"use client";

import { useState } from "react";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { monthKeyOf } from "@/utils/date";
import { useActivities } from "@/features/activities/hooks/useActivities";
import { useDashboardStats } from "@/features/home/hooks/useDashboardStats";
import { useUserGoal } from "@/features/home/hooks/useUserGoal";
import DashboardStats from "@/features/home/components/DashboardStats";
import EmissionTrendChart from "@/features/home/components/EmissionTrendChart";
import EmissionSourcesChart from "@/features/home/components/EmissionSourcesChart";
import RecentActivities from "@/features/home/components/RecentActivities";
import EcoTip from "@/features/home/components/EcoTip";
import GreetingClock from "@/features/home/components/GreetingClock";
import LogActivityModal from "@/features/home/components/LogActivityModal";

export default function HomePage() {
  const user = useCurrentUser();
  const goal = useUserGoal();
  const { activities } = useActivities();
  const [chartMonth, setChartMonth] = useState(() => monthKeyOf());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stats = useDashboardStats(activities, chartMonth, goal.monthlyGoalKg);

  return (
    <div>
      <header className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <GreetingClock name={user?.name} />
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
        <EcoTip />
      </section>

      <LogActivityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
