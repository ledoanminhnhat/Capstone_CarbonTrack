import { FaStar, FaTrashCan } from "react-icons/fa6";
import PresenceAvatar from "@/components/ui/PresenceAvatar";
import Select from "@/components/ui/Select";
import { formatDate } from "@/utils/date";
import { lastActiveLabel } from "@/utils/presence";
import type { Role } from "@/types";
import type { AdminUser } from "../types";

const ROLE_OPTIONS = [
  { label: "User", value: "USER" },
  { label: "Admin", value: "ADMIN" },
];

/** Danh sách user dạng thẻ (thay bảng trên mobile). */
export default function UserCardList({
  users,
  loading,
  myId,
  emptyText,
  onRoleChange,
  onDelete,
}: {
  users: AdminUser[];
  loading: boolean;
  myId?: string;
  emptyText: string;
  onRoleChange: (u: AdminUser, role: Role) => void;
  onDelete: (u: AdminUser) => void;
}) {
  if (loading) return <p className="m-0 py-8 text-center text-muted">Loading...</p>;
  if (users.length === 0) return <p className="m-0 py-8 text-center text-muted">{emptyText}</p>;

  return (
    <ul className="m-0 p-0 list-none flex flex-col">
      {users.map((u) => {
        const isSelf = u.id === myId;
        return (
          <li key={u.id} className={`py-4 border-b border-line last:border-b-0 ${isSelf ? "bg-brand-50/50 -mx-4 px-4" : ""}`}>
            <div className="flex items-center gap-3">
              <PresenceAvatar id={u.id} name={u.name} avatarUrl={u.avatarUrl} lastActiveAt={u.lastActiveAt} size="md" />
              <div className="flex-1 min-w-0">
                <div className="text-ink font-semibold truncate">
                  {u.name}
                  {isSelf && <span className="ml-1.5 text-[0.75rem] font-medium text-brand-600">(you)</span>}
                </div>
                <div className="text-muted text-[0.8rem] truncate">{u.email}</div>
              </div>
              {!isSelf && (
                <button
                  onClick={() => onDelete(u)}
                  aria-label={`Delete ${u.name}`}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50"
                >
                  <FaTrashCan size={15} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 mt-3 flex-wrap text-[0.8rem] text-muted">
              {isSelf ? (
                <span className="font-semibold text-ink">{u.role === "ADMIN" ? "Admin" : "User"}</span>
              ) : (
                <Select value={u.role} onChange={(v) => onRoleChange(u, v as Role)} options={ROLE_OPTIONS} className="w-[110px]" />
              )}
              <span className="inline-flex items-center gap-1 text-brand-600 font-semibold">
                <FaStar size={11} /> {u.points.toLocaleString()}
              </span>
              <span>{u.activityCount} activities</span>
              <span className="ml-auto text-right">
                Joined {formatDate(u.createdAt)}
                <br />
                {lastActiveLabel(u.lastActiveAt)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
