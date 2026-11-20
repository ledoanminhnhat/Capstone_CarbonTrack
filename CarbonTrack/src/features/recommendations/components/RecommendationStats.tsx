import { FaArrowTrendDown, FaCloud, FaLeaf, FaLightbulb } from "react-icons/fa6";
import StatTile from "@/components/ui/StatTile";
import type { CategoryBreakdown, RecommendationResponse } from "../types";

export default function RecommendationStats({
  rec,
  top,
  savingPct,
  periodLabel,
}: {
  rec: RecommendationResponse;
  top?: CategoryBreakdown;
  savingPct: number;
  periodLabel: string;
}) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
      <StatTile
        variant="brand"
        label={`Footprint ${periodLabel}`}
        value={rec.totalCo2.toFixed(1)}
        unit="kg CO₂e"
        icon={<FaCloud size={16} />}
      />
      <StatTile
        label="Can be saved"
        value={rec.totalPotentialSaving.toFixed(1)}
        unit={`kg CO₂e · ${savingPct}%`}
        icon={<FaArrowTrendDown size={16} />}
      />
      <StatTile
        label="Biggest source"
        value={top?.category ?? "—"}
        unit={top ? `${top.percent}% · mostly ${top.topSub}` : undefined}
        icon={<FaLeaf size={16} />}
        iconCls="text-rose-500 bg-rose-50"
      />
      <StatTile
        variant="ocean"
        label="Actions for you"
        value={rec.recommendations.length}
        unit="recommendations"
        icon={<FaLightbulb size={16} />}
      />
    </section>
  );
}
