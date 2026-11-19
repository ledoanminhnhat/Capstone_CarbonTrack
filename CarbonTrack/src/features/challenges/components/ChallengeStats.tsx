import { MdBolt, MdEmojiEvents, MdExplore, MdStar } from "react-icons/md";
import StatTile from "@/components/ui/StatTile";

export default function ChallengeStats({
  inProgress,
  completed,
  available,
  pointsEarned,
}: {
  inProgress: number;
  completed: number;
  available: number;
  pointsEarned: number;
}) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <StatTile variant="brand" label="In progress" value={inProgress} unit="challenges" icon={<MdBolt size={20} />} />
      <StatTile
        label="Completed"
        value={completed}
        unit="challenges"
        icon={<MdEmojiEvents size={20} />}
        iconCls="text-amber-500 bg-amber-50"
      />
      <StatTile label="Available" value={available} unit="to join" icon={<MdExplore size={20} />} iconCls="text-sky-600 bg-sky-50" />
      <StatTile
        variant="ocean"
        label="Points earned"
        value={pointsEarned.toLocaleString()}
        unit="from challenges"
        icon={<MdStar size={20} />}
      />
    </section>
  );
}
