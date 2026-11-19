import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import type { ChallengeView } from "../types";
import { isCompleted, progressPercent } from "../utils";

/** Thẻ challenge đã tham gia (đang làm / đã xong). */
export default function JoinedChallengeCard({ c, onClick }: { c: ChallengeView; onClick?: () => void }) {
  const done = isCompleted(c);
  const pct = progressPercent(c);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-card flex flex-col cursor-pointer transition-all duration-200 hover:shadow-glow-brand hover:-translate-y-0.5"
    >
      <div className={`h-20 relative flex justify-center ${done ? "bg-gradient-sunrise" : "bg-gradient-leaf"}`}>
        <div className="absolute -bottom-7 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-card text-2xl">
          {c.emoji}
        </div>
      </div>
      <div className="pt-10 pb-6 px-6 flex flex-col flex-1">
        <h4 className="m-0 font-bold text-[1.05rem] text-center mb-4 text-ink">{c.title}</h4>
        <ProgressBar value={c.progress} max={c.target} done={done} />
        <div className="flex justify-between text-[0.85rem] font-semibold mt-2 mb-5">
          <span className="text-muted">
            {c.progress}/{c.target} · {pct}%
          </span>
          <span className="text-brand-600">+{c.points} pts</span>
        </div>
        <div className="mt-auto flex justify-center">
          <Badge tone={done ? "warning" : "success"} dot>
            {done ? "Completed" : "In progress"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
