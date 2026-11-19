"use client";

import { useCallback, useEffect, useState } from "react";

export const SETTINGS_TABS = ["profile", "password", "tracking", "appearance", "reminders"] as const;
export type SettingsTab = (typeof SETTINGS_TABS)[number];

const isTab = (v: string): v is SettingsTab => (SETTINGS_TABS as readonly string[]).includes(v);

/**
 * Mục Settings đang mở (profile, password, tracking, appearance, reminders hoặc null nếu đang ở trang chủ Settings danh mục).
 * Đồng bộ với URL hash (/settings#tracking). Nếu không có hash -> hiển thị danh sách mục.
 */
export function useSettingsTab() {
  const [tab, setTabState] = useState<SettingsTab | null>(null);

  useEffect(() => {
    const read = () => {
      const h = window.location.hash.slice(1);
      if (isTab(h)) {
        setTabState(h);
      } else {
        setTabState(null);
      }
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const setTab = useCallback((t: SettingsTab | null) => {
    setTabState(t);
    if (t) {
      window.history.pushState(null, "", `#${t}`);
    } else {
      window.history.pushState(null, "", window.location.pathname);
    }
  }, []);

  return { tab, setTab };
}
