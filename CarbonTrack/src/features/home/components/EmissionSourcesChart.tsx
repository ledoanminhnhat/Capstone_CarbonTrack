"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import SectionTitle from "@/components/ui/SectionTitle";
import type { PieSlice } from "../hooks/useDashboardStats";
import { PieTooltip } from "./ChartTooltip";

export default function EmissionSourcesChart({ data, monthLabel }: { data: PieSlice[]; monthLabel: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card">
      <SectionTitle className="mb-6" subtitle={`By category · ${monthLabel}`}>
        Emission Sources
      </SectionTitle>
      <div style={{ width: "100%", height: 200 }}>
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted text-[0.9rem]">No data yet this month</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {data.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {data.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4">
          {data.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-ink text-[0.8rem]">
                {s.name} <span className="text-muted">({s.value}%)</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
