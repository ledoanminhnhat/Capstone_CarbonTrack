import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { categoryColor } from "@/constants/categories";
import type { ChallengeView } from "@/features/challenges/types";
import type { Recommendation } from "../types";
import ActivityIconBox from "@/features/activities/components/ActivityIconBox";

const DIFFICULTY_TONE = { EASY: "success", MEDIUM: "warning", HARD: "danger" } as const;

export default function RecommendationCard({
  rec,
  challenge,
  isTop,
  applying,
  onApply,
}: {
  rec: Recommendation;
  challenge?: ChallengeView;
  isTop: boolean;
  applying: boolean;
  onApply: () => void;
}) {
  const done = challenge?.status === "COMPLETED";

  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex flex-wrap items-center gap-5">
      <div className="relative shrink-0">
        {/* icon theo hoạt động gợi ý chuyển sang (vd Bus), không có thì theo nguồn phát thải */}
        <ActivityIconBox value={rec.challengeMatch ?? rec.source} size="lg" />
        {isTop && (
          <span className="absolute -top-2 -right-2 bg-gradient-sunrise text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full">
            TOP
          </span>
        )}
      </div>

      <div className="flex-1 min-w-[220px]">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h4 className="m-0 font-bold text-ink text-[1rem]">{rec.title}</h4>
          <Badge tone={DIFFICULTY_TONE[rec.difficulty]} variant="outline" size="sm">
            {rec.difficulty}
          </Badge>
        </div>
        <p className="m-0 text-muted text-[0.85rem]">{rec.description}</p>
        <p className="m-0 mt-1 text-[0.8rem] flex items-center gap-1.5 text-muted">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColor(rec.category) }} />
          Based on your {rec.source} activities
        </p>
        {challenge && (
          <div className="mt-3">
            <ProgressBar value={challenge.progress} max={challenge.target} done={done} />
            <p className="m-0 mt-1 text-[0.75rem] text-muted">
              {done ? "Challenge completed" : `Challenge: ${challenge.progress}/${challenge.target} ${rec.challengeMatch}`}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 ml-auto">
        <div className="text-right">
          <div className="text-[0.75rem] text-muted">Save up to</div>
          <div className="text-xl font-extrabold text-brand-600">
            {rec.estimatedSavingKg}
            <span className="text-[0.8rem] font-semibold text-muted"> kg CO₂e</span>
          </div>
        </div>
        {rec.challengeMatch &&
          (challenge ? (
            <Link href="/challenges" className="no-underline">
              <Badge tone={done ? "warning" : "success"} dot>
                {done ? "Completed" : "In challenges"}
              </Badge>
            </Link>
          ) : (
            <Button variant="gradient" size="sm" onClick={onApply} disabled={applying}>
              {applying ? "Starting..." : "Start Challenge"}
            </Button>
          ))}
      </div>
    </div>
  );
}
