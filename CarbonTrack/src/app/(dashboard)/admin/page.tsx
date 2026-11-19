"use client";

import PageHeader from "@/components/ui/PageHeader";
import Alert from "@/components/ui/Alert";
import Pagination from "@/components/ui/Pagination";
import { PAGE_SIZE } from "@/constants/app";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { usePagination } from "@/hooks/usePagination";
import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers";
import { useUserFilters } from "@/features/admin/hooks/useUserFilters";
import AdminStats from "@/features/admin/components/AdminStats";
import UserFilterBar from "@/features/admin/components/UserFilterBar";
import UserTable from "@/features/admin/components/UserTable";

function AdminUsers() {
  const me = useCurrentUser();
  const { users, loading, error, setRole, remove } = useAdminUsers();
  const f = useUserFilters(users);
  const pager = usePagination(f.filtered, PAGE_SIZE.adminUsers, f.filterKey);

  return (
    <div>
      <PageHeader title="User Management" subtitle="View accounts, change roles and remove users." />
      <Alert className="mb-4">{error}</Alert>
      <AdminStats {...f.stats} />

      <div className="bg-surface rounded-2xl shadow-card p-6">
        <UserFilterBar
          search={f.search}
          onSearch={f.setSearch}
          role={f.role}
          onRole={f.setRole}
          shown={f.filtered.length}
          total={users.length}
        />
        <UserTable
          users={pager.pageItems}
          loading={loading}
          myId={me?.id}
          emptyText={users.length === 0 ? "No users yet." : "No users match your search."}
          onRoleChange={setRole}
          onDelete={remove}
        />
        <Pagination {...pager} />
      </div>
    </div>
  );
}

export default function AdminPage() {
  // Chỉ ADMIN mới vào được, còn lại đá về /home
  const allowed = useRequireAuth("ADMIN");
  return allowed ? <AdminUsers /> : null;
}
