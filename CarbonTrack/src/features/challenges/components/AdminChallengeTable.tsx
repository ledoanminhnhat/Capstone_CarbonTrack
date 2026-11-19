import { MdDelete } from "react-icons/md";
import Badge from "@/components/ui/Badge";
import SectionTitle from "@/components/ui/SectionTitle";
import { Table, Th, Td, Tr, TableMessage } from "@/components/ui/Table";
import type { AdminChallenge } from "../types";

export default function AdminChallengeTable({
  challenges,
  loading,
  onDelete,
}: {
  challenges: AdminChallenge[];
  loading: boolean;
  onDelete: (c: AdminChallenge) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <SectionTitle count={challenges.length} className="mb-5">
        All challenges
      </SectionTitle>
      <Table>
        <thead>
          <tr>
            <Th>Challenge</Th>
            <Th>Rule</Th>
            <Th>Target</Th>
            <Th>Points</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableMessage colSpan={5}>Loading...</TableMessage>
          ) : challenges.length === 0 ? (
            <TableMessage colSpan={5}>No challenges yet.</TableMessage>
          ) : (
            challenges.map((c) => (
              <Tr key={c.id}>
                <Td className="text-ink font-medium">
                  <span className="flex items-center gap-3">
                    <span className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center text-lg">{c.emoji}</span>
                    {c.title}
                  </span>
                </Td>
                <Td>
                  <Badge tone={c.matchType === "CATEGORY" ? "info" : "neutral"}>
                    {c.matchType === "CATEGORY" ? "Category" : "Activity"}: {c.matchValue}
                  </Badge>
                </Td>
                <Td className="text-ink">{c.target}×</Td>
                <Td className="text-brand-600 font-semibold">+{c.points}</Td>
                <Td className="text-right">
                  <button
                    onClick={() => onDelete(c)}
                    className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 text-[0.85rem] font-semibold"
                  >
                    <MdDelete size={18} /> Delete
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
