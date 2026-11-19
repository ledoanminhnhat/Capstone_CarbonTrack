import { FaTrashCan } from "react-icons/fa6";
import Badge from "@/components/ui/Badge";
import ActivityIconBox from "@/features/activities/components/ActivityIconBox";
import type { AdminChallenge } from "../types";

/** Danh sách Admin Challenge dạng thẻ (thay bảng trên mobile). */
export default function AdminChallengeCardList({
  challenges,
  loading,
  onDelete,
}: {
  challenges: AdminChallenge[];
  loading: boolean;
  onDelete: (c: AdminChallenge) => void;
}) {
  if (loading) return <p className="m-0 py-8 text-center text-muted">Loading...</p>;
  if (challenges.length === 0) return <p className="m-0 py-8 text-center text-muted">No challenges yet.</p>;

  return (
    <ul className="m-0 p-0 list-none flex flex-col">
      {challenges.map((c) => (
        <li key={c.id} className="py-3 border-b border-line last:border-b-0 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2.5 min-w-0">
              <ActivityIconBox value={c.matchValue} size="sm" />
              <span className="text-ink font-semibold truncate text-[0.95rem]">{c.title}</span>
            </span>
            <button
              onClick={() => onDelete(c)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 shrink-0"
              aria-label={`Delete ${c.title}`}
            >
              <FaTrashCan size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <Badge tone={c.matchType === "CATEGORY" ? "info" : "neutral"} size="sm">
              {c.matchType === "CATEGORY" ? "Category" : "Activity"}: {c.matchValue}
            </Badge>
            <span className="text-muted">Target: <strong className="text-ink">{c.target}×</strong></span>
            <span className="ml-auto font-bold text-brand-600">+{c.points} pts</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
