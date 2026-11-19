"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * State được nhớ trong localStorage (vd sidebar đang thu gọn).
 * Lần render đầu dùng `initial` (khớp với server), đọc giá trị đã lưu sau khi mount.
 */
export function useLocalStorageState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* localStorage bị chặn / dữ liệu hỏng */
    }
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(v));
        } catch {
          /* bỏ qua */
        }
        return v;
      });
    },
    [key]
  );

  return [value, set] as const;
}
