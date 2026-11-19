import { FaStar } from "react-icons/fa6";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { ChallengeView } from "../types";
import ActivityIconBox from "@/features/activities/components/ActivityIconBox";

/** Thẻ challenge chưa tham gia. */
export default function AvailableChallengeCard({
  c,
  joining,
  onJoin,
  onClick,
}: {
  c: ChallengeView;
  joining: boolean;
  onJoin: () => void;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-surface p-6 rounded-2xl shadow-card flex flex-col cursor-pointer transition-all duration-200 hover:shadow-glow-brand hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4 mb-4">
        <ActivityIconBox value={c.matchValue} size="md" />
        <div className="flex-1 min-w-0">
          <h4 className="m-0 font-bold text-[1.05rem] text-ink">{c.title}</h4>
          <p className="m-0 mt-1 text-muted text-[0.85rem]">
            Goal: {c.target}× {c.matchValue}
          </p>
        </div>
        <Badge tone="brand" icon={<FaStar size={14} />}>
          +{c.points}
        </Badge>
      </div>
      <p className="text-muted text-[0.9rem] mb-6 flex-1 m-0">{c.description}</p>
      <Button
        variant="gradient"
        size="full"
        onClick={(e) => {
          e.stopPropagation();
          onJoin();
        }}
        disabled={joining}
      >
        {joining ? "Joining..." : "Join Challenge"}
      </Button>
    </div>
  );
}
