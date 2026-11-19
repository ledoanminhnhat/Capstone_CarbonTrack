import { MdSearch } from "react-icons/md";
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
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="w-full md:w-[280px]">
        <Input
          type="text"
          placeholder="Search activity or detail..."
          icon={<MdSearch size={20} />}
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
        />
      </div>
      <div className="w-[180px]">
        <Select value={filters.category} onChange={(v) => onChange("category", v)} options={CATEGORY_OPTIONS} />
      </div>
      <div className="w-[140px]">
        <Select value={filters.status} onChange={(v) => onChange("status", v)} options={STATUS_OPTIONS} />
      </div>
      <div className="w-[140px]">
        <Select value={filters.month} onChange={(v) => onChange("month", v)} options={monthOptions} />
      </div>
    </div>
  );
}
