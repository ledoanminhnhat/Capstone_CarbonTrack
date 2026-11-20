import type React from "react";
import { FaTrashCan, FaUsers } from "react-icons/fa6";
import Badge from "@/components/ui/Badge";
import SectionTitle from "@/components/ui/SectionTitle";
import { Table, Th, Td, Tr, TableMessage } from "@/components/ui/Table";
import type { AdminChallenge } from "../types";
import ActivityIconBox from "@/features/activities/components/ActivityIconBox";
import AdminChallengeCardList from "./AdminChallengeCardList";

/** "5 done (42%)" */
export const completionText = (c: AdminChallenge) =>
  `${c.completed} done${c.participants > 0 ? ` (${Math.round((c.completed / c.participants) * 100)}%)` : ""}`;

/** Danh sách challenge của admin; bấm 1 dòng để xem chi tiết + người tham gia. */
export default function AdminChallengeTable({
  challenges,
  total,
  loading,
  onDelete,
  onSelect,
  toolbar,
}: {
  /** danh sách đã lọc */
  challenges: AdminChallenge[];
  /** tổng số trước khi lọc (để biết "không có challenge" hay "không khớp bộ lọc") */
  total: number;
  loading: boolean;
  onDelete: (c: AdminChallenge) => void;
  onSelect: (c: AdminChallenge) => void;
  /** bộ lọc đặt cạnh tiêu đề */
  toolbar?: React.ReactNode;
}) {
  const emptyText = total === 0 ? "No challenges yet." : "No challenges match this filter.";
  return (
    <div className="bg-surface rounded-2xl shadow-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <SectionTitle count={challenges.length} className="">
          All challenges
        </SectionTitle>
        {toolbar}
      </div>

      {/* Mobile: dạng thẻ */}
      <div className="md:hidden">
        <AdminChallengeCardList
          challenges={challenges}
          loading={loading}
          emptyText={emptyText}
          onDelete={onDelete}
          onSelect={onSelect}
        />
      </div>

      {/* Desktop / tablet: dạng bảng */}
      <div className="hidden md:block">
        <Table>
          <thead>
            <tr>
              <Th>Challenge</Th>
              <Th>Rule</Th>
              <Th>Target</Th>
              <Th>Points</Th>
              <Th>Participants</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableMessage colSpan={6}>Loading...</TableMessage>
            ) : challenges.length === 0 ? (
              <TableMessage colSpan={6}>{emptyText}</TableMessage>
            ) : (
              challenges.map((c) => (
                <Tr key={c.id} onClick={() => onSelect(c)}>
                  <Td className="text-ink font-medium">
                    <span className="flex items-center gap-3">
                      <ActivityIconBox value={c.matchValue} size="sm" />
                      {c.title}
                    </span>
                  </Td>
                  <Td>
                    <Badge tone={c.matchType === "CATEGORY" ? "info" : "brand"}>
                      {c.matchType === "CATEGORY" ? "Category" : "Activity"}: {c.matchValue}
                    </Badge>
                  </Td>
                  <Td className="text-ink">{c.target}×</Td>
                  <Td className="text-brand-600 font-semibold">+{c.points}</Td>
                  <Td>
                    <span className="inline-flex items-center gap-2 text-ink">
                      <FaUsers size={14} className="text-muted" />
                      <span className="font-semibold">{c.participants}</span>
                      <span className="text-muted text-xs">· {completionText(c)}</span>
                    </span>
                  </Td>
                  <Td className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // không mở chi tiết
                        onDelete(c);
                      }}
                      className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 text-[0.85rem] font-semibold"
                    >
                      <FaTrashCan size={14} /> Delete
                    </button>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
