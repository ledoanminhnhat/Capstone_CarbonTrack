import { MdCloud, MdEco, MdLightbulb, MdTrendingDown } from "react-icons/md";
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
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatTile
        variant="brand"
        label={`Footprint ${periodLabel}`}
        value={rec.totalCo2.toFixed(1)}
        unit="kg CO₂e"
        icon={<MdCloud size={20} />}
      />
      <StatTile
        label="Can be saved"
        value={rec.totalPotentialSaving.toFixed(1)}
        unit={`kg CO₂e · ${savingPct}%`}
        icon={<MdTrendingDown size={20} />}
      />
      <StatTile
        label="Biggest source"
        value={top?.category ?? "—"}
        unit={top ? `${top.percent}% · mostly ${top.topSub}` : undefined}
        icon={<MdEco size={20} />}
        iconCls="text-rose-500 bg-rose-50"
      />
      <StatTile
        variant="ocean"
        label="Actions for you"
        value={rec.recommendations.length}
        unit="recommendations"
        icon={<MdLightbulb size={20} />}
      />
    </section>
  );
}
