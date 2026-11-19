"use client";

import { useAsync } from "@/hooks/useAsync";
import { useInterval } from "@/hooks/useInterval";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { errorMessage } from "@/utils/error";
import type { Role } from "@/types";
import type { AdminUser } from "../types";
import { changeRole, deleteUser, getUsers } from "../services/admin.service";

/** Admin: danh sách user, đổi role, xóa. */
export function useAdminUsers() {
  const toast = useToast();
  const confirm = useConfirm();
  const { data, setData, loading, error, reload } = useAsync<AdminUser[]>(getUsers, [], []);
  useInterval(() => reload({ silent: true }), 60_000); // cập nhật chấm online

  const replace = (u: AdminUser) => setData((prev) => (prev ?? []).map((x) => (x.id === u.id ? u : x)));

  const setRole = async (u: AdminUser, role: Role) => {
    try {
      replace(await changeRole(u.id, role));
      toast.success(`${u.name} is now ${role}`);
    } catch (e) {
      toast.error(errorMessage(e, "Failed to change role"));
    }
  };

  const remove = async (u: AdminUser) => {
    const ok = await confirm({
      title: `Delete ${u.name}?`,
      message: "Their activities, posts and comments will also be deleted. This cannot be undone.",
      confirmText: "Delete user",
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteUser(u.id);
      setData((prev) => (prev ?? []).filter((x) => x.id !== u.id));
      toast.success(`${u.name} deleted`);
    } catch (e) {
      toast.error(errorMessage(e, "Failed to delete user"));
    }
  };

  return { users: data ?? [], loading, error, setRole, remove };
}
