import type { Activity } from "../types";
import ActivityName from "./ActivityName";
import CategoryBadge from "./CategoryBadge";
import StatusBadge from "./StatusBadge";

/** Danh sách activity dạng thẻ (thay bảng trên mobile). */
export default function ActivityCardList({
  rows,
  loading = false,
  emptyText,
}: {
  rows: Activity[];
  loading?: boolean;
  emptyText: string;
}) {
  if (loading) return <p className="m-0 py-8 text-center text-muted">Loading...</p>;
  if (rows.length === 0) return <p className="m-0 py-8 text-center text-muted">{emptyText}</p>;

  return (
    <ul className="m-0 p-0 list-none flex flex-col">
      {rows.map((a) => (
        <li key={a.id} className="py-3 border-b border-line last:border-b-0">
          <div className="flex items-center justify-between gap-3">
            <span className="text-ink font-semibold min-w-0">
              <ActivityName activity={a} extra={<span className="text-muted font-normal text-[0.85rem]">· {a.detail}</span>} />
            </span>
            <span className="text-ink font-bold whitespace-nowrap">{a.co2} kg</span>
          </div>
          <div className="flex items-center gap-2 mt-2 pl-[42px] flex-wrap">
            <CategoryBadge category={a.category} />
            <StatusBadge status={a.status} />
            <span className="ml-auto text-muted text-[0.8rem]">{a.date}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
