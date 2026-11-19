"use client";

import { useAsync } from "@/hooks/useAsync";
import { useInterval } from "@/hooks/useInterval";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { errorMessage } from "@/utils/error";
import type { Author } from "../types";
import { getMutedUsers, muteUser, unmuteUser } from "../services/community.service";

/** Danh sách người đã ẩn + ẩn / bỏ ẩn. Trả về true nếu thao tác thành công. */
export function useMutedUsers() {
  const toast = useToast();
  const confirm = useConfirm();
  const { data, setData, reload } = useAsync<Author[]>(getMutedUsers, [], []);
  useInterval(() => reload({ silent: true }), 60_000); // cập nhật chấm online

  const mute = async (author: Author): Promise<boolean> => {
    const ok = await confirm({
      title: `Hide ${author.name}?`,
      message: "You won't see their posts and comments. You can undo this anytime.",
      confirmText: "Hide user",
    });
    if (!ok) return false;
    try {
      await muteUser(author.id);
      setData((prev) => [...(prev ?? []), author]);
      toast.success(`${author.name} is hidden`);
      return true;
    } catch (e) {
      toast.error(errorMessage(e, "Failed to hide user"));
      return false;
    }
  };

  const unmute = async (author: Author): Promise<boolean> => {
    try {
      await unmuteUser(author.id);
      setData((prev) => (prev ?? []).filter((m) => m.id !== author.id));
      toast.success(`${author.name} is visible again`);
      return true;
    } catch (e) {
      toast.error(errorMessage(e, "Failed"));
      return false;
    }
  };

  return { muted: data ?? [], mute, unmute };
}
