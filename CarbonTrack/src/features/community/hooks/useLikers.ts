"use client";

import { useAsync } from "@/hooks/useAsync";
import type { Author } from "../types";
import { getCommentLikers, getPostLikers } from "../services/community.service";

export interface LikersTarget {
  kind: "post" | "comment";
  id: string;
}

/** Danh sách người đã like 1 bài / 1 comment (chỉ tải khi mở modal). */
export function useLikers(target: LikersTarget | null) {
  const { data, loading, error } = useAsync<Author[]>(
    async () => {
      if (!target) return [];
      return target.kind === "post" ? getPostLikers(target.id) : getCommentLikers(target.id);
    },
    [target?.kind, target?.id],
    []
  );
  return { likers: data ?? [], loading, error };
}
