"use client";

import { useEffect, useRef, useState } from "react";
import { FaFilter, FaMagnifyingGlass, FaRotateLeft, FaXmark } from "react-icons/fa6";
import Input from "@/components/ui/Input";
import Select, { type SelectOption } from "@/components/ui/Select";
import { CATEGORIES } from "@/constants/categories";
import { ALL, type HistoryFilters } from "../hooks/useHistoryFilters";

const CATEGORY_OPTIONS = [{ label: "All Category", value: ALL }, ...CATEGORIES.map((c) => ({ label: c, value: c }))];
const STATUS_OPTIONS = [
  { label: "All Status", value: ALL },
  { label: "High", value: "High" },
  { label: "Low", value: "Low" },
];

export default function HistoryFilterBar({
  filters,
  onChange,
  monthOptions,
}: {
  filters: HistoryFilters;
  onChange: <K extends keyof HistoryFilters>(key: K, value: HistoryFilters[K]) => void;
  monthOptions: SelectOption[];
}) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Đếm số lượng filter đang active (khác ALL)
  const activeCount = [
    filters.category !== ALL,
    filters.status !== ALL,
    filters.month !== ALL,
  ].filter(Boolean).length;

  const handleReset = () => {
    onChange("category", ALL);
    onChange("status", ALL);
    onChange("month", ALL);
  };

  // Đóng popover khi click ra ngoài
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 relative">
      {/* Ô tìm kiếm */}
      <div className="flex-1 min-w-[240px] max-w-[400px]">
        <Input
          type="text"
          placeholder="Search activity or detail..."
          icon={<FaMagnifyingGlass size={16} />}
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
        />
      </div>

      {/* Nút Filter chỉ hiện icon đặt ngay cạnh search */}
      <div className="relative shrink-0" ref={popoverRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          title="Filter activities"
          aria-label="Filter activities"
          className={`relative w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
            open || activeCount > 0
              ? "bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-50/10 dark:text-brand-400 shadow-sm"
              : "bg-surface border-line-strong text-muted hover:text-ink hover:bg-subtle"
          }`}
          aria-expanded={open}
        >
          <FaFilter size={15} className={activeCount > 0 ? "text-brand-600 dark:text-brand-400" : "text-muted"} />
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-500 text-white text-[0.7rem] flex items-center justify-center font-bold ring-2 ring-surface shadow">
              {activeCount}
            </span>
          )}
        </button>

        {/* Dropdown Popover chứa các filter */}
        {open && (
          <div className="absolute left-0 mt-2 w-[300px] bg-surface rounded-2xl shadow-card border border-line p-4 z-30 flex flex-col gap-4 animate-[sheet-up_0.15s_ease-out]">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <span className="font-bold text-ink text-sm flex items-center gap-2">
                <FaFilter size={12} className="text-muted" /> Filter Activities
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted hover:text-ink p-1 rounded-lg"
                aria-label="Close"
              >
                <FaXmark size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Category</label>
                <Select
                  value={filters.category}
                  onChange={(v) => onChange("category", v)}
                  options={CATEGORY_OPTIONS}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Impact Status</label>
                <Select
                  value={filters.status}
                  onChange={(v) => onChange("status", v)}
                  options={STATUS_OPTIONS}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Time Range</label>
                <Select
                  value={filters.month}
                  onChange={(v) => onChange("month", v)}
                  options={monthOptions}
                />
              </div>
            </div>

            {/* Chân menu: Reset filter */}
            <div className="flex items-center justify-between pt-2 border-t border-line">
              <button
                type="button"
                onClick={handleReset}
                disabled={activeCount === 0}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <FaRotateLeft size={11} /> Reset all
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hiển thị badge các filter đang chọn để người dùng dễ nhìn & tắt nhanh */}
      {filters.category !== ALL && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-subtle border border-line text-xs font-medium text-ink">
          Category: <strong className="text-brand-600">{filters.category}</strong>
          <button type="button" onClick={() => onChange("category", ALL)} className="text-muted hover:text-rose-500">
            <FaXmark size={11} />
          </button>
        </span>
      )}
      {filters.status !== ALL && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-subtle border border-line text-xs font-medium text-ink">
          Status: <strong className="text-brand-600">{filters.status}</strong>
          <button type="button" onClick={() => onChange("status", ALL)} className="text-muted hover:text-rose-500">
            <FaXmark size={11} />
          </button>
        </span>
      )}
      {filters.month !== ALL && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-subtle border border-line text-xs font-medium text-ink">
          Month: <strong className="text-brand-600">{filters.month}</strong>
          <button type="button" onClick={() => onChange("month", ALL)} className="text-muted hover:text-rose-500">
            <FaXmark size={11} />
          </button>
        </span>
      )}
    </div>
  );
}
