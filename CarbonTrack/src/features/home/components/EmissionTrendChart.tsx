"use client";

import { AreaChart, Area, XAxis, ResponsiveContainer, ReferenceLine, Tooltip } from "recharts";
import Select, { type SelectOption } from "@/components/ui/Select";
import SectionTitle from "@/components/ui/SectionTitle";
import { LineTooltip } from "./ChartTooltip";

export default function EmissionTrendChart({
  data,
  monthLabel,
  month,
  monthOptions,
  onMonthChange,
  dailyGoalKg,
}: {
  data: { name: string; value: number }[];
  monthLabel: string;
  month: string;
  monthOptions: SelectOption[];
  onMonthChange: (m: string) => void;
  /** mục tiêu mỗi ngày -> đường nét đứt */
  dailyGoalKg: number;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card">
      <div className="flex items-start justify-between mb-6">
        <SectionTitle className="" subtitle={`Daily CO₂ in ${monthLabel}`}>
          Emissions Trend
        </SectionTitle>
        <div className="w-[140px]">
          <Select value={month} onChange={onMonthChange} options={monthOptions} />
        </div>
      </div>
      <div style={{ width: "100%", height: 200 }}>
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted text-[0.9rem]">No data yet this month</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#999" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={12}
              />
              <ReferenceLine y={Math.round(dailyGoalKg * 10) / 10} stroke="#a0aec0" strokeDasharray="3 3" />
              <Tooltip content={<LineTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
