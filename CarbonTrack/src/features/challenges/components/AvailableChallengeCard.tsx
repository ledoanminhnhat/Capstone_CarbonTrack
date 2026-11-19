import { MdStar } from "react-icons/md";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { ChallengeView } from "../types";

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
      className="bg-white p-6 rounded-2xl shadow-card flex flex-col cursor-pointer transition-all duration-200 hover:shadow-glow-brand hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-2xl shrink-0">{c.emoji}</div>
        <div className="flex-1 min-w-0">
          <h4 className="m-0 font-bold text-[1.05rem] text-ink">{c.title}</h4>
          <p className="m-0 mt-1 text-muted text-[0.85rem]">
            Goal: {c.target}× {c.matchValue}
          </p>
        </div>
        <Badge tone="brand" icon={<MdStar size={14} />}>
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
