"use client";

import { useAsync } from "@/hooks/useAsync";
import type { Author } from "../types";
import { getCommentLikers, getPostLikers, getPostSharers } from "../services/community.service";

export interface LikersTarget {
  /** post / comment = người like; shares = người đã share bài */
  kind: "post" | "comment" | "shares";
  id: string;
}

/** Danh sách người đã like 1 bài / 1 comment, hoặc đã share 1 bài (chỉ tải khi mở modal). */
export function useLikers(target: LikersTarget | null) {
  const { data, loading, error } = useAsync<Author[]>(
    async () => {
      if (!target) return [];
      if (target.kind === "shares") return getPostSharers(target.id);
      return target.kind === "post" ? getPostLikers(target.id) : getCommentLikers(target.id);
    },
    [target?.kind, target?.id],
    []
  );
  return { likers: data ?? [], loading, error };
}
