import type { Activity } from "@/features/activities/types";
import { downloadCsv } from "@/utils/csv";
import { isoDate } from "@/utils/date";

/** Xuất các dòng đang lọc ra CSV. */
export function exportHistoryCsv(rows: Activity[]) {
  downloadCsv(
    `carbontrack-history-${isoDate()}.csv`,
    ["Date", "Category", "Activity", "Detail", "CO2 (kg)", "Status"],
    rows.map((a) => [a.date, a.category, a.activity, a.detail, a.co2, a.status])
  );
}
