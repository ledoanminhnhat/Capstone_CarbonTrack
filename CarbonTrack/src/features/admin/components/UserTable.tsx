import { FaTrashCan, FaUserShield } from "react-icons/fa6";
import PresenceAvatar from "@/components/ui/PresenceAvatar";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import { Table, Th, Td, TableMessage } from "@/components/ui/Table";
import { formatDate } from "@/utils/date";
import { isOnline, lastActiveLabel } from "@/utils/presence";
import type { Role } from "@/types";
import type { AdminUser } from "../types";

const ROLE_OPTIONS = [
  { label: "User", value: "USER" },
  { label: "Admin", value: "ADMIN" },
];

function RoleBadge({ role }: { role: Role }) {
  return (
    role === "ADMIN" ? (
      <Badge tone="brand" variant="solid" icon={<FaUserShield size={14} />}>
        Admin
      </Badge>
    ) : (
      <Badge tone="neutral" variant="outline">
        User
      </Badge>
    )
  );
}

export default function UserTable({
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
  return (
    <Table minWidth={860}>
      <thead>
        <tr>
          <Th>User</Th>
          <Th>Role</Th>
          <Th className="text-right">Points</Th>
          <Th className="text-right">Activities</Th>
          <Th>Joined</Th>
          <Th>Last active</Th>
          <Th />
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <TableMessage colSpan={7}>Loading...</TableMessage>
        ) : users.length === 0 ? (
          <TableMessage colSpan={7}>{emptyText}</TableMessage>
        ) : (
          users.map((u) => {
            const isSelf = u.id === myId;
            return (
              <tr key={u.id} className={`[&:last-child>td]:border-b-0 ${isSelf ? "bg-brand-50/50" : "hover:bg-subtle"}`}>
                <Td>
                  <div className="flex items-center gap-3 min-w-0">
                    <PresenceAvatar id={u.id} name={u.name} avatarUrl={u.avatarUrl} lastActiveAt={u.lastActiveAt} />
                    <div className="min-w-0">
                      <div className="text-ink font-semibold truncate">
                        {u.name}
                        {isSelf && <span className="ml-1.5 text-[0.75rem] font-medium text-brand-600">(you)</span>}
                      </div>
                      <div className="text-muted text-[0.8rem] truncate">{u.email}</div>
                    </div>
                  </div>
                </Td>
                <Td>
                  {isSelf ? (
                    <RoleBadge role={u.role} />
                  ) : (
                    <Select
                      value={u.role}
                      onChange={(v) => onRoleChange(u, v as Role)}
                      options={ROLE_OPTIONS}
                      className="w-[110px]"
                    />
                  )}
                </Td>
                <Td className="text-right text-brand-600 font-semibold">{u.points.toLocaleString()}</Td>
                <Td className="text-right text-ink">{u.activityCount.toLocaleString()}</Td>
                <Td className="text-muted whitespace-nowrap">{formatDate(u.createdAt)}</Td>
                <Td className="whitespace-nowrap">
                  {isOnline(u.lastActiveAt) ? (
                    <Badge tone="success" size="sm" dot>
                      Online
                    </Badge>
                  ) : (
                    <span className="text-muted text-[0.85rem]">{lastActiveLabel(u.lastActiveAt).replace("Active ", "")}</span>
                  )}
                </Td>
                <Td className="text-right">
                  <button
                    onClick={() => onDelete(u)}
                    disabled={isSelf}
                    className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 text-[0.85rem] font-semibold disabled:text-muted/50 disabled:cursor-not-allowed"
                    title={isSelf ? "You cannot delete yourself" : "Delete user"}
                  >
                    <FaTrashCan size={18} /> Delete
                  </button>
                </Td>
              </tr>
            );
          })
        )}
      </tbody>
    </Table>
  );
}
