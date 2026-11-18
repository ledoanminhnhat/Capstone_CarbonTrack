"use client";

import { useState, useEffect } from "react";
import {
  MdSearch,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdFirstPage,
  MdLastPage,
  MdCloud,
  MdListAlt,
  MdLocalFireDepartment,
  MdShowChart,
  MdFileDownload,
} from "react-icons/md";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import StatTile from "@/components/ui/StatTile";
import { getActivities, type Activity } from "@/lib/activities";
import { categoryColor } from "@/lib/categories";

const ITEMS_PER_PAGE = 8;

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActivity, setFilterActivity] = useState("All Activity");
  const [filterStatus, setFilterStatus] = useState("Status");
  const [filterMonth, setFilterMonth] = useState("All Time");

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Tải dữ liệu thật khi mở trang
  useEffect(() => {
    getActivities()
      .then(setActivities)
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, []);

  // Đổi bộ lọc thì về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterActivity, filterStatus, filterMonth]);

  const q = searchQuery.toLowerCase();
  const filtered = activities.filter(
    (a) =>
      (a.activity.toLowerCase().includes(q) || a.detail.toLowerCase().includes(q)) &&
      (filterActivity === "All Activity" || a.category === filterActivity) &&
      (filterStatus === "Status" || a.status === filterStatus) &&
      (filterMonth === "All Time" || a.date.endsWith(filterMonth)) // date dạng dd/MM/yyyy
  );

  // Tự sinh danh sách tháng từ dữ liệu thật (MM/yyyy), mới nhất lên đầu
  const monthOptions = [
    { label: "All Time", value: "All Time" },
    ...Array.from(new Set(activities.map((a) => a.date.slice(3))))
      .sort((a, b) => {
        const [ma, ya] = a.split("/").map(Number);
        const [mb, yb] = b.split("/").map(Number);
        return yb - ya || mb - ma;
      })
      .map((m) => ({ label: m, value: m })),
  ];

  // Thống kê theo bộ lọc hiện tại
  const totalCo2 = filtered.reduce((s, a) => s + a.co2, 0);
  const highCount = filtered.filter((a) => a.status === "High").length;
  const avgCo2 = filtered.length ? totalCo2 / filtered.length : 0;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Xuất CSV đúng các dòng đang lọc (Excel mở được)
  const handleExport = () => {
    const header = ["Date", "Category", "Activity", "Detail", "CO2 (kg)", "Status"];
    const rows = filtered.map((a) => [a.date, a.category, a.activity, a.detail, a.co2, a.status]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    // BOM để Excel đọc đúng UTF-8
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `carbontrack-history-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const pageBtn = (disabled: boolean) =>
    `w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
      disabled
        ? "text-gray-300 pointer-events-none"
        : "text-ink hover:bg-brand-50 hover:text-brand-600 cursor-pointer"
    }`;

  const th = "text-left text-muted font-semibold text-[0.85rem] pb-4 border-b border-gray-100";
  const td = "py-4 border-b border-gray-100 text-[0.9rem]";

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

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatTile
          variant="brand"
          label="Total emissions"
          value={totalCo2.toFixed(1)}
          unit="kg CO₂e"
          icon={<MdCloud size={20} />}
        />
        <StatTile
          label="Activities"
          value={filtered.length}
          unit="logged"
          icon={<MdListAlt size={20} />}
          iconCls="text-sky-600 bg-sky-50"
        />
        <StatTile
          label="Average"
          value={avgCo2.toFixed(1)}
          unit="kg per activity"
          icon={<MdShowChart size={20} />}
          iconCls="text-amber-500 bg-amber-50"
        />
        <StatTile
          label="High emission"
          value={highCount}
          unit="activities ≥ 5 kg"
          icon={<MdLocalFireDepartment size={20} />}
          iconCls="text-rose-500 bg-rose-50"
        />
      </section>

      <div className="bg-white rounded-2xl shadow-card p-6">
        {/* Bộ lọc */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="w-full md:w-[280px]">
            <Input
              type="text"
              placeholder="Search activity or detail..."
              icon={<MdSearch size={20} />}
              iconPosition="left"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-[180px]">
            <Select
              value={filterActivity}
              onChange={setFilterActivity}
              options={[
                { label: "All Activity", value: "All Activity" },
                { label: "Transport", value: "Transport" },
                { label: "Food", value: "Food" },
                { label: "Energy", value: "Energy" },
                { label: "Shopping", value: "Shopping" },
              ]}
            />
          </div>
          <div className="w-[140px]">
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: "All Status", value: "Status" },
                { label: "High", value: "High" },
                { label: "Low", value: "Low" },
              ]}
            />
          </div>
          <div className="w-[140px]">
            <Select value={filterMonth} onChange={setFilterMonth} options={monthOptions} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className={th}>Date</th>
                <th className={th}>Activity</th>
                <th className={th}>Detail</th>
                <th className={th}>CO₂</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody className="[&>tr:last-child>td]:border-b-0">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted">
                    {activities.length === 0
                      ? "No activities yet. Log your first one from the Dashboard!"
                      : "No activities match these filters."}
                  </td>
                </tr>
              ) : (
                currentItems.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/60">
                    <td className={`${td} text-muted`}>{a.date}</td>
                    <td className={`${td} text-ink font-medium`}>
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: categoryColor(a.category) }}
                        />
                        {a.activity}
                        <span className="text-muted text-xs font-normal">{a.category}</span>
                      </span>
                    </td>
                    <td className={`${td} text-muted`}>{a.detail}</td>
                    <td className={`${td} text-ink font-semibold`}>{a.co2} kg</td>
                    <td className={td}>
                      <Badge tone={a.status === "High" ? "danger" : "success"} dot>
                        {a.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 text-muted text-[0.85rem]">
          <span>
            {filtered.length === 0
              ? "0 results"
              : `${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filtered.length
                )} of ${filtered.length}`}
          </span>
          <div className="flex items-center gap-1">
            <span className={pageBtn(currentPage === 1)} onClick={() => setCurrentPage(1)}>
              <MdFirstPage size={22} />
            </span>
            <span
              className={pageBtn(currentPage === 1)}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <MdKeyboardArrowLeft size={22} />
            </span>
            <span className="px-2 text-ink font-semibold">
              {currentPage} / {totalPages}
            </span>
            <span
              className={pageBtn(currentPage === totalPages)}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <MdKeyboardArrowRight size={22} />
            </span>
            <span
              className={pageBtn(currentPage === totalPages)}
              onClick={() => setCurrentPage(totalPages)}
            >
              <MdLastPage size={22} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
