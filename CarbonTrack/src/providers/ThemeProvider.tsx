"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type ThemePref = "light" | "dark" | "system";
export const THEME_STORAGE_KEY = "ct_theme";

interface ThemeApi {
  /** lựa chọn của người dùng */
  theme: ThemePref;
  /** theme thực tế đang hiển thị */
  resolved: "light" | "dark";
  setTheme: (t: ThemePref) => void;
}

const ThemeContext = createContext<ThemeApi | null>(null);

const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* localStorage bị chặn */
  }
  return "system";
}

/** Bật / tắt class "dark" trên <html> (Tailwind darkMode: "class"). */
function apply(resolved: "light" | "dark") {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePref>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  // đọc lựa chọn đã lưu khi mở app
  useEffect(() => {
    setThemeState(readPref());
  }, []);

  // áp dụng + theo dõi hệ điều hành
  useEffect(() => {
    const update = () => {
      const r = theme === "system" ? (systemDark() ? "dark" : "light") : theme;
      setResolved(r);
      apply(r);
    };

    update();

    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => update();

    // Hỗ trợ cả addEventListener và addListener (cho tương thích trình duyệt cũ hơn)
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else if ("addListener" in mq) {
      (mq as any).addListener(handler);
      return () => (mq as any).removeListener(handler);
    }
  }, [theme]);

  const setTheme = useCallback((t: ThemePref) => {
    setThemeState(t);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {
      /* bỏ qua */
    }
    const r = t === "system" ? (systemDark() ? "dark" : "light") : t;
    setResolved(r);
    apply(r);
  }, []);

  return <ThemeContext.Provider value={{ theme, resolved, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeApi {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/**
 * Script chạy trước khi React tải: gắn class "dark" ngay để không bị nháy trắng.
 * Phải khớp logic với ThemeProvider ở trên.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")||"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;
