import React from "react";

/** Khung tooltip chung cho các biểu đồ. */
export function TooltipBox({ children }: { children: React.ReactNode }) {
  return <div className="bg-surface px-3 py-2 rounded-lg shadow-card text-[0.8rem]">{children}</div>;
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; payload: Record<string, unknown> }[];
}

/** Biểu đồ đường: ngày + kg CO2. */
export function LineTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <TooltipBox>
      <div className="font-semibold text-ink">Day {String(p.payload.name)}</div>
      <div className="text-muted mt-0.5">{p.value} kg CO₂</div>
    </TooltipBox>
  );
}

/** Biểu đồ tròn: category + % + kg. */
export function PieTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as { name: string; value: number; co2: number; color: string };
  return (
    <TooltipBox>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="font-semibold text-ink">{item.name}</span>
      </div>
      <div className="text-muted mt-1">
        {item.value}% · {item.co2} kg CO₂
      </div>
    </TooltipBox>
  );
}
