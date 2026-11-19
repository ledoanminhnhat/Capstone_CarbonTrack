import { MdGroup, MdAdminPanelSettings, MdTrendingUp, MdListAlt } from "react-icons/md";
import StatTile from "@/components/ui/StatTile";
import { percent } from "@/utils/emission";

export default function AdminStats({
  total,
  admins,
  active,
  activities,
}: {
  total: number;
  admins: number;
  active: number;
  activities: number;
}) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatTile variant="brand" label="Total users" value={total} unit="accounts" icon={<MdGroup size={20} />} />
      <StatTile
        label="Admins"
        value={admins}
        unit={`${total - admins} regular users`}
        icon={<MdAdminPanelSettings size={20} />}
        iconCls="text-violet-600 bg-violet-50"
      />
      <StatTile
        label="Active users"
        value={active}
        unit={`${percent(active, total)}% have logged activities`}
        icon={<MdTrendingUp size={20} />}
        iconCls="text-amber-500 bg-amber-50"
      />
      <StatTile
        variant="ocean"
        label="Activities logged"
        value={activities.toLocaleString()}
        unit="across all users"
        icon={<MdListAlt size={20} />}
      />
    </section>
  );
}
