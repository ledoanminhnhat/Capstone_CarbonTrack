"use client";

import { useCallback, useEffect, useState } from "react";

export const SETTINGS_TABS = ["profile", "password", "tracking", "appearance", "reminders"] as const;
export type SettingsTab = (typeof SETTINGS_TABS)[number];

const isTab = (v: string): v is SettingsTab => (SETTINGS_TABS as readonly string[]).includes(v);

/**
 * Mục Settings đang mở, đồng bộ với URL hash (/settings#tracking)
 * để tải lại trang / link từ nơi khác vẫn mở đúng mục.
 */
export function useSettingsTab() {
  const [tab, setTabState] = useState<SettingsTab>("profile");

  useEffect(() => {
    const read = () => {
      const h = window.location.hash.slice(1);
      if (isTab(h)) setTabState(h);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const setTab = useCallback((t: SettingsTab) => {
    setTabState(t);
    window.history.replaceState(null, "", `#${t}`);
  }, []);

  return { tab, setTab };
}
