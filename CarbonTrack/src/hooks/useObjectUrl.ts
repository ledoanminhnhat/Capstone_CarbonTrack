"use client";

import { useEffect, useState } from "react";

/** URL tạm để xem trước 1 File; tự giải phóng khi đổi file / unmount. */
export function useObjectUrl(file: File | null | undefined): string {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!file) {
      setUrl("");
      return;
    }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url;
}
