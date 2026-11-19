"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { errorMessage } from "@/utils/error";

/**
 * Tải dữ liệu bất đồng bộ: trả về data / loading / error / reload / setData.
 * `fn` chạy lại khi `deps` đổi.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList = [], initial?: T) {
  const [data, setData] = useState<T | undefined>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fnRef = useRef(fn);
  fnRef.current = fn;

  /** silent = làm mới ngầm (không bật loading, không báo lỗi) — dùng cho polling. */
  const reload = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = !!opts?.silent;
    if (!silent) {
      setLoading(true);
      setError("");
    }
    try {
      setData(await fnRef.current());
    } catch (e) {
      if (!silent) setError(errorMessage(e, "Failed to load data"));
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, setData, loading, error, reload };
}
