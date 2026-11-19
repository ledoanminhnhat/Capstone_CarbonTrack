"use client";

import { MdFileDownload } from "react-icons/md";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/Toast";
import { PAGE_SIZE } from "@/constants/app";
import { usePagination } from "@/hooks/usePagination";
import { useActivities } from "@/features/activities/hooks/useActivities";
import { useHistoryFilters } from "@/features/history/hooks/useHistoryFilters";
import { exportHistoryCsv } from "@/features/history/utils/exportHistory";
import HistoryStats from "@/features/history/components/HistoryStats";
import HistoryFilterBar from "@/features/history/components/HistoryFilterBar";
import HistoryTable from "@/features/history/components/HistoryTable";

export default function HistoryPage() {
  const toast = useToast();
  const { activities, loading } = useActivities();
  const { filters, set, filtered, monthOptions, stats } = useHistoryFilters(activities);
  const pager = usePagination(filtered, PAGE_SIZE.history, filters);

  const handleExport = () => {
    exportHistoryCsv(filtered);
    toast.success(`Exported ${filtered.length} activities`);
  };

  return (
    <div>
      <PageHeader
        title="History Activity"
        subtitle="Every activity you've logged, with its carbon footprint."
        actions={
          <Button variant="gradient" onClick={handleExport} disabled={filtered.length === 0}>
            <MdFileDownload size={20} className="mr-2" /> Export CSV
          </Button>
        }
      />

      <HistoryStats {...stats} />

      <div className="bg-white rounded-2xl shadow-card p-6">
        <HistoryFilterBar filters={filters} onChange={set} monthOptions={monthOptions} />
        <HistoryTable
          rows={pager.pageItems}
          loading={loading}
          emptyText={
            activities.length === 0
              ? "No activities yet. Log your first one from the Dashboard!"
              : "No activities match these filters."
          }
        />
        <Pagination {...pager} />
      </div>
    </div>
  );
}
