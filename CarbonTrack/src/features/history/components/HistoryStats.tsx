import { MdCloud, MdListAlt, MdLocalFireDepartment, MdShowChart } from "react-icons/md";
import StatTile from "@/components/ui/StatTile";
import { HIGH_EMISSION_KG } from "@/constants/app";

export default function HistoryStats({
  total,
  count,
  average,
  highCount,
}: {
  total: number;
  count: number;
  average: number;
  highCount: number;
}) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatTile variant="brand" label="Total emissions" value={total.toFixed(1)} unit="kg CO₂e" icon={<MdCloud size={20} />} />
      <StatTile label="Activities" value={count} unit="logged" icon={<MdListAlt size={20} />} iconCls="text-sky-600 bg-sky-50" />
      <StatTile
        label="Average"
        value={average.toFixed(1)}
        unit="kg per activity"
        icon={<MdShowChart size={20} />}
        iconCls="text-amber-500 bg-amber-50"
      />
      <StatTile
        label="High emission"
        value={highCount}
        unit={`activities ≥ ${HIGH_EMISSION_KG} kg`}
        icon={<MdLocalFireDepartment size={20} />}
        iconCls="text-rose-500 bg-rose-50"
      />
    </section>
  );
}
