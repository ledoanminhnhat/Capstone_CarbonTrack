import { FaMagnifyingGlass } from "react-icons/fa6";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { RoleFilter } from "../types";

const ROLE_FILTER_OPTIONS = [
  { label: "All roles", value: "ALL" },
  { label: "Users", value: "USER" },
  { label: "Admins", value: "ADMIN" },
];

export default function UserFilterBar({
  search,
  onSearch,
  role,
  onRole,
  shown,
  total,
}: {
  search: string;
  onSearch: (v: string) => void;
  role: RoleFilter;
  onRole: (r: RoleFilter) => void;
  shown: number;
  total: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="w-full md:w-[300px]">
        <Input
          type="text"
          placeholder="Search name or email..."
          icon={<FaMagnifyingGlass size={16} />}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="w-[160px]">
        <Select value={role} onChange={(v) => onRole(v as RoleFilter)} options={ROLE_FILTER_OPTIONS} />
      </div>
      <span className="ml-auto text-muted text-[0.85rem]">
        Showing {shown} of {total}
      </span>
    </div>
  );
}
