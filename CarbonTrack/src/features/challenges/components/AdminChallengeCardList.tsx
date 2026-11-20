import { FaTrashCan, FaUsers } from "react-icons/fa6";
import Badge from "@/components/ui/Badge";
import ActivityIconBox from "@/features/activities/components/ActivityIconBox";
import type { AdminChallenge } from "../types";

/** Danh sách Admin Challenge dạng thẻ (thay bảng trên mobile); bấm thẻ để xem chi tiết. */
export default function AdminChallengeCardList({
  challenges,
  loading,
  emptyText = "No challenges yet.",
  onDelete,
  onSelect,
}: {
  challenges: AdminChallenge[];
  loading: boolean;
  emptyText?: string;
  onDelete: (c: AdminChallenge) => void;
  onSelect: (c: AdminChallenge) => void;
}) {
  if (loading) return <p className="m-0 py-8 text-center text-muted">Loading...</p>;
  if (challenges.length === 0) return <p className="m-0 py-8 text-center text-muted">{emptyText}</p>;

  return (
    <ul className="m-0 p-0 list-none flex flex-col">
      {challenges.map((c) => (
        <li
          key={c.id}
          onClick={() => onSelect(c)}
          className="py-3 border-b border-line last:border-b-0 flex flex-col gap-2 cursor-pointer active:bg-subtle"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2.5 min-w-0">
              <ActivityIconBox value={c.matchValue} size="sm" />
              <span className="text-ink font-semibold truncate text-[0.95rem]">{c.title}</span>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // không mở chi tiết
                onDelete(c);
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 shrink-0"
              aria-label={`Delete ${c.title}`}
            >
              <FaTrashCan size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <Badge tone={c.matchType === "CATEGORY" ? "info" : "brand"} size="sm">
              {c.matchType === "CATEGORY" ? "Category" : "Activity"}: {c.matchValue}
            </Badge>
            <span className="text-muted">Target: <strong className="text-ink">{c.target}×</strong></span>
            <span className="ml-auto font-bold text-brand-600">+{c.points} pts</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <FaUsers size={12} />
            <strong className="text-ink">{c.participants}</strong> joined ·{" "}
            <strong className="text-ink">{c.completed}</strong> completed
          </span>
        </li>
      ))}
    </ul>
  );
}
