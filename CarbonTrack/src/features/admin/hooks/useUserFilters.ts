"use client";

import { useMemo, useState } from "react";
import type { AdminUser, RoleFilter } from "../types";

/** Tìm theo tên / email, lọc role, và thống kê cho trang User Management. */
export function useUserFilters(users: AdminUser[]) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("ALL");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users
      .filter(
        (u) =>
          (role === "ALL" || u.role === role) &&
          (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      )
      // admin lên đầu, rồi theo tên
      .sort((a, b) => (a.role === b.role ? a.name.localeCompare(b.name) : a.role === "ADMIN" ? -1 : 1));
  }, [users, search, role]);

  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((u) => u.role === "ADMIN").length,
      active: users.filter((u) => u.activityCount > 0).length,
      activities: users.reduce((s, u) => s + u.activityCount, 0),
    }),
    [users]
  );

  return { search, setSearch, role, setRole, filtered, stats, filterKey: `${search}|${role}` };
}
