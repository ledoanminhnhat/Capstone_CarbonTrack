"use client";

import { useCallback } from "react";
import { useToast } from "@/components/ui/Toast";

/**
 * Chia sẻ 1 link: điện thoại mở share sheet, máy tính copy link + toast.
 * Trả về true nếu đã chia sẻ / copy, false nếu người dùng hủy.
 */
export function useShare() {
  const toast = useToast();
  return useCallback(
    async (url: string, title?: string): Promise<boolean> => {
      try {
        if (navigator.share) {
          await navigator.share({ title, url });
        } else {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard");
        }
        return true;
      } catch {
        return false; // người dùng hủy
      }
    },
    [toast]
  );
}
