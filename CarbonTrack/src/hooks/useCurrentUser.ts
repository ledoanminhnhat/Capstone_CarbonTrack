"use client";

import { useEffect, useState } from "react";
import type { AuthUser } from "@/types";
import { getStoredUser, USER_UPDATED_EVENT } from "@/services/session";

/** User đang đăng nhập; tự cập nhật khi đổi tên / avatar. null trước khi mount. */
export function useCurrentUser(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const refresh = () => setUser(getStoredUser());
    refresh();
    window.addEventListener(USER_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(USER_UPDATED_EVENT, refresh);
  }, []);

  return user;
}
