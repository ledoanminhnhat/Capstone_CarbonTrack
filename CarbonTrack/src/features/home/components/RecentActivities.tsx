import Link from "next/link";
import { Table, Th, Td, Tr, TableMessage } from "@/components/ui/Table";
import ActivityName from "@/features/activities/components/ActivityName";
import StatusBadge from "@/features/activities/components/StatusBadge";
import CategoryBadge from "@/features/activities/components/CategoryBadge";
import type { Activity } from "@/features/activities/types";

export default function RecentActivities({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-surface rounded-2xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="m-0 text-ink text-[1.1rem] font-bold">Recent Activities</h3>
        <Link href="/history" className="text-brand-600 text-[0.85rem] font-semibold no-underline hover:underline">
          View all →
        </Link>
      </div>
      <Table minWidth={520}>
        <thead>
          <tr>
            <Th>Activity</Th>
            <Th>Category</Th>
            <Th>Date</Th>
            <Th>CO₂</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {activities.length === 0 ? (
            <TableMessage colSpan={5}>No activities yet. Log your first one!</TableMessage>
          ) : (
            activities.map((a) => (
              <Tr key={a.id}>
                <Td className="text-ink font-medium">
                  <ActivityName activity={a} extra={<span className="text-muted font-normal">({a.detail})</span>} />
                </Td>
                <Td>
                  <CategoryBadge category={a.category} />
                </Td>
                <Td className="text-muted">{a.date}</Td>
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
  );
}
