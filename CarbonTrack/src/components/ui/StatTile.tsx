import React from "react";

type Variant = "white" | "brand" | "ocean" | "sunrise";

interface StatTileProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  icon: React.ReactNode;
  variant?: Variant;
  /** màu icon cho variant "white", vd "text-rose-500 bg-rose-50" */
  iconCls?: string;
}

const gradient: Record<Exclude<Variant, "white">, string> = {
  brand: "bg-gradient-brand shadow-glow-brand",
  ocean: "bg-gradient-ocean shadow-glow-ocean",
  sunrise: "bg-gradient-sunrise shadow-card",
};

/** Ô thống kê giống 4 ô ở Dashboard. */
export default function StatTile({
  label,
  value,
  unit,
  icon,
  variant = "white",
  iconCls = "text-brand-600 bg-brand-50",
}: StatTileProps) {
  const colored = variant !== "white";
  return (
    <div
      className={`rounded-2xl p-4 md:p-5 ${
        colored ? `${gradient[variant]} text-white` : "bg-surface shadow-card"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`text-[0.85rem] leading-snug ${colored ? "text-white/80" : "text-muted"}`}>{label}</span>
        <span
          className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
            colored ? "bg-white/15 text-white/70" : iconCls
          }`}
        >
          {icon}
        </span>
      </div>
      <div className={`text-2xl font-extrabold ${colored ? "" : "text-ink"}`}>{value}</div>
      {unit && <div className={`text-xs ${colored ? "text-white/70" : "text-muted"}`}>{unit}</div>}
    </div>
  );
}
