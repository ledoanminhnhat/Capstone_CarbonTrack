"use client";

import { useEffect, useState } from "react";

/** Phân trang phía client; tự về trang 1 khi `resetKey` đổi (vd bộ lọc). */
export function usePagination<T>(items: T[], pageSize: number, resetKey?: unknown) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => setPage(1), [resetKey]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  return {
    page,
    totalPages,
    pageItems: items.slice(start, start + pageSize),
    from: items.length ? start + 1 : 0,
    to: Math.min(start + pageSize, items.length),
    total: items.length,
    first: () => setPage(1),
    prev: () => setPage((p) => Math.max(1, p - 1)),
    next: () => setPage((p) => Math.min(totalPages, p + 1)),
    last: () => setPage(totalPages),
  };
}
