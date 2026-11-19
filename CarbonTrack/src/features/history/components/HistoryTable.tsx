import { Table, Th, Td, Tr, TableMessage } from "@/components/ui/Table";
import ActivityName from "@/features/activities/components/ActivityName";
import StatusBadge from "@/features/activities/components/StatusBadge";
import CategoryBadge from "@/features/activities/components/CategoryBadge";
import type { Activity } from "@/features/activities/types";
import ActivityCardList from "@/features/activities/components/ActivityCardList";

export default function HistoryTable({
  rows,
  loading,
  emptyText,
}: {
  rows: Activity[];
  loading: boolean;
  emptyText: string;
}) {
  return (
    <>
    <div className="md:hidden">
      <ActivityCardList rows={rows} loading={loading} emptyText={emptyText} />
    </div>
    <div className="hidden md:block">
    <Table>
      <thead>
        <tr>
          <Th>Date</Th>
          <Th>Activity</Th>
          <Th>Category</Th>
          <Th>Detail</Th>
          <Th>CO₂</Th>
          <Th>Status</Th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <TableMessage colSpan={6}>Loading...</TableMessage>
        ) : rows.length === 0 ? (
          <TableMessage colSpan={6}>{emptyText}</TableMessage>
        ) : (
          rows.map((a) => (
            <Tr key={a.id}>
              <Td className="text-muted">{a.date}</Td>
              <Td className="text-ink font-medium">
                <ActivityName activity={a} />
              </Td>
              <Td>
                <CategoryBadge category={a.category} />
              </Td>
              <Td className="text-muted">{a.detail}</Td>
              <Td className="text-ink font-semibold">{a.co2} kg</Td>
              <Td>
                <StatusBadge status={a.status} />
              </Td>
            </Tr>
          ))
        )}
      </tbody>
    </Table>
    </div>
    </>
  );
}
