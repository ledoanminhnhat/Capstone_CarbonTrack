import Link from "next/link";
import { FaCloud, FaFire, FaFlag, FaStar, FaTriangleExclamation } from "react-icons/fa6";
import StatTile from "@/components/ui/StatTile";
import ProgressBar from "@/components/ui/ProgressBar";
import { round1 } from "@/utils/emission";

/** Thẻ mục tiêu: còn lại bao nhiêu trong tháng (hoặc đã vượt), kèm mục tiêu tháng + năm. */
function GoalTile({
  used,
  remaining,
  monthlyGoalKg,
  yearlyGoalKg,
}: {
  used: number;
  remaining: number;
  monthlyGoalKg: number;
  yearlyGoalKg: number;
}) {
  const over = remaining < 0;
  return (
    <Link
      href="/settings#tracking"
      title="Change your goal in Settings → Tracking"
      className={`rounded-2xl p-5 no-underline block transition-shadow hover:shadow-glow-brand ${
        over ? "bg-rose-50 shadow-card ring-1 ring-rose-200" : "bg-surface shadow-card"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[0.85rem] ${over ? "text-rose-600 font-semibold" : "text-muted"}`}>
          {over ? "Over monthly goal" : "Remaining goal"}
        </span>
        <span
          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            over ? "text-rose-600 bg-rose-100" : "text-amber-500 bg-amber-50"
          }`}
        >
          {over ? <FaTriangleExclamation size={16} /> : <FaFlag size={16} />}
        </span>
      </div>
      <div className={`text-2xl font-extrabold ${over ? "text-rose-600" : "text-ink"}`}>
        {over ? "+" : ""}
        {Math.abs(remaining).toFixed(1)}
        <span className="text-sm font-semibold text-muted"> kg</span>
      </div>
      <ProgressBar value={used} max={monthlyGoalKg} done={over} className="h-1.5 my-2" />
      <div className="text-muted text-xs">
        Goal {round1(monthlyGoalKg)} kg/month · {yearlyGoalKg.toLocaleString()} kg/year
      </div>
    </Link>
  );
}

export default function DashboardStats({
  totalThisMonth,
  highestLabel,
  remainingGoal,
  monthlyGoalKg,
  yearlyGoalKg,
  points,
}: {
  totalThisMonth: number;
  highestLabel: string;
  remainingGoal: number;
  monthlyGoalKg: number;
  yearlyGoalKg: number;
  points: number;
}) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatTile variant="brand" label="Total this month" value={totalThisMonth.toFixed(1)} unit="kg CO₂e" icon={<FaCloud size={16} />} />
      <StatTile
        label="Highest activity"
        value={highestLabel}
        icon={<FaFire size={16} />}
        iconCls="text-rose-500 bg-rose-50"
      />
      <GoalTile
        used={totalThisMonth}
        remaining={remainingGoal}
        monthlyGoalKg={monthlyGoalKg}
        yearlyGoalKg={yearlyGoalKg}
      />
      <StatTile variant="ocean" label="Score" value={points.toLocaleString()} unit="points" icon={<FaStar size={16} />} />
    </section>
  );
}
