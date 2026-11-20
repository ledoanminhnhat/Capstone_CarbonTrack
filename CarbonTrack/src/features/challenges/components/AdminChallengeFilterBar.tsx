"use client";

import { FaRotateLeft } from "react-icons/fa6";
import Select from "@/components/ui/Select";
import type { MatchType } from "../types";
import { matchValuesFor } from "../hooks/useAdminChallenges";

export const ALL = "ALL";

export interface ChallengeFilters {
  /** ALL | SUBCATEGORY (activity) | CATEGORY */
  matchType: typeof ALL | MatchType;
  /** ALL hoặc 1 giá trị cụ thể (Bus, Transport…) */
  matchValue: string;
}

export const EMPTY_FILTERS: ChallengeFilters = { matchType: ALL, matchValue: ALL };

const TYPE_OPTIONS = [
  { label: "All rules", value: ALL },
  { label: "Activity", value: "SUBCATEGORY" },
  { label: "Category", value: "CATEGORY" },
];

/** Lọc challenge theo luật: loại (Activity / Category) rồi tới giá trị cụ thể. */
export default function AdminChallengeFilterBar({
  filters,
  onChange,
}: {
  filters: ChallengeFilters;
  onChange: (f: ChallengeFilters) => void;
}) {
  const valueOptions =
    filters.matchType === ALL
      ? []
      : [
          { label: filters.matchType === "CATEGORY" ? "All categories" : "All activities", value: ALL },
          ...matchValuesFor(filters.matchType).map((v) => ({ label: v, value: v })),
        ];
  const active = filters.matchType !== ALL;

  return (
    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
      <div className="flex-1 md:flex-none md:w-36">
        {/* đổi loại thì reset giá trị */}
        <Select
          value={filters.matchType}
          onChange={(v) => onChange({ matchType: v as ChallengeFilters["matchType"], matchValue: ALL })}
          options={TYPE_OPTIONS}
        />
      </div>
      {filters.matchType !== ALL && (
        <div className="flex-1 md:flex-none md:w-44">
          <Select
            value={filters.matchValue}
            onChange={(v) => onChange({ ...filters, matchValue: v })}
            options={valueOptions}
          />
        </div>
      )}
      {active && (
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 px-1"
        >
          <FaRotateLeft size={11} /> Reset
        </button>
      )}
    </div>
  );
}

/** Áp bộ lọc lên danh sách. */
export function applyChallengeFilters<T extends { matchType: MatchType; matchValue: string }>(
  list: T[],
  f: ChallengeFilters,
): T[] {
  return list.filter(
    (c) =>
      (f.matchType === ALL || c.matchType === f.matchType) &&
      (f.matchValue === ALL || c.matchValue === f.matchValue),
  );
}
