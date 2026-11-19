import { useMemo } from "react";
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import { categoryColor } from "@/constants/categories";
import type { CategoryBreakdown } from "../types";

/** Biểu đồ tròn (conic-gradient) + tỉ trọng theo category + thanh "now vs after". */
export default function FootprintDrivers({
  userName,
  totalCo2,
  breakdown,
  after,
  savingPct,
}: {
  userName?: string;
  totalCo2: number;
  breakdown: CategoryBreakdown[];
  after: number;
  savingPct: number;
}) {
  const donut = useMemo(() => {
    let acc = 0;
    const stops = breakdown.map((b) => {
      const start = acc;
      acc += b.percent * 3.6;
      return `${categoryColor(b.category)} ${start}deg ${acc}deg`;
    });
    return stops.length ? `conic-gradient(${stops.join(", ")})` : "#f3f4f6";
  }, [breakdown]);

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 flex flex-col self-start">
      <SectionTitle className="mb-6" subtitle={`${userName ? `${userName}'s` : "Your"} emissions by category`}>
        Footprint Drivers
      </SectionTitle>

      <div className="flex justify-center mb-6">
        <div className="w-40 h-40 relative">
          <div className="absolute inset-0 rounded-full" style={{ background: donut }} />
          <div className="absolute inset-[22%] bg-white rounded-full flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-ink">{totalCo2.toFixed(0)}</span>
            <span className="text-[0.7rem] text-muted">kg CO₂e</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {breakdown.map((b) => (
          <div key={b.category}>
            <div className="flex items-center justify-between text-[0.9rem]">
              <span className="flex items-center gap-2 text-ink font-semibold">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryColor(b.category) }} />
                {b.category}
              </span>
              <span className="text-muted">
                {b.co2} kg · <span className="text-ink font-semibold">{b.percent}%</span>
              </span>
            </div>
            <div className="pl-[18px] text-[0.8rem] text-muted">
              ↳ {b.topSub} ({b.topSubPercent}%)
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <div className="flex justify-between text-[0.8rem] font-semibold mb-2">
          <span className="text-muted">Now {totalCo2.toFixed(1)} kg</span>
          <span className="text-brand-600">After plan {after} kg</span>
        </div>
        <div className="h-2.5 w-full bg-brand-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-leaf" style={{ width: `${100 - savingPct}%` }} />
        </div>
      </div>

      <Link href="/history" className="mt-6 text-brand-600 text-[0.85rem] font-semibold no-underline hover:underline text-center">
        See all data →
      </Link>
    </div>
  );
}
