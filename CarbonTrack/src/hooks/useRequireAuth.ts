"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/types";
import { getStoredUser, isLoggedIn } from "@/services/session";
import { getProfile } from "@/services/user.service";

/**
 * Chặn trang khi chưa đăng nhập (đá về /login), hoặc sai role (đá về /home).
 * Trả về true khi đã kiểm tra xong và được phép vào.
 */
export function useRequireAuth(role?: Role): boolean {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    if (role && getStoredUser()?.role !== role) {
      router.replace("/home");
      return;
    }
    setAllowed(true);
    if (!role) getProfile().catch(() => {}); // đồng bộ tên/avatar mới nhất
  }, [router, role]);

  return allowed;
}
