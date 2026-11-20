"use client";

import { FaFileArrowDown } from "react-icons/fa6";
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
      />

      <HistoryStats {...stats} />

      <div className="bg-surface rounded-2xl shadow-card p-6">
        <HistoryFilterBar
          filters={filters}
          onChange={set}
          monthOptions={monthOptions}
          actions={
            // Export nằm cuối hàng search/filter: mobile chỉ icon, web có chữ
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={filtered.length === 0}
              title="Export the filtered activities as CSV"
              aria-label="Export CSV"
              className="h-11 w-11 md:w-auto !p-0 md:!px-3.5 gap-2 !text-sm"
            >
              <FaFileArrowDown size={15} className="text-brand-600" />
              <span className="hidden md:inline">Export CSV</span>
            </Button>
          }
        />
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
