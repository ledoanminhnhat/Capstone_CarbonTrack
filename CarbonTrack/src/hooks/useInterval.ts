"use client";

import { useEffect, useRef } from "react";

/** Gọi `fn` mỗi `ms` mili-giây (bỏ qua khi tab đang ẩn). Dùng để làm mới trạng thái online. */
export function useInterval(fn: () => void, ms: number) {
  const ref = useRef(fn);
  ref.current = fn;

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") ref.current();
    }, ms);
    return () => clearInterval(id);
  }, [ms]);
}
