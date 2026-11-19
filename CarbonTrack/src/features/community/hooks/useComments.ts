"use client";

import { useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { errorMessage } from "@/utils/error";
import type { Comment } from "../types";
import { addComment, deleteComment, getComments, toggleCommentLike } from "../services/community.service";

/** Comment của 1 bài: tải, gửi, xóa, like. onCountChange báo cho bài cập nhật số comment. */
export function useComments(postId: string, onCountChange: (delta: number) => void) {
  const toast = useToast();
  const confirm = useConfirm();
  const { data, setData, loading } = useAsync<Comment[]>(() => getComments(postId), [postId]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const patch = (id: string, p: Partial<Comment>) =>
    setData((prev) => (prev ?? []).map((c) => (c.id === id ? { ...c, ...p } : c)));

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const c = await addComment(postId, text.trim());
      setData((prev) => [...(prev ?? []), c]);
      setText("");
      onCountChange(1);
    } catch (e) {
      toast.error(errorMessage(e, "Failed to comment"));
    } finally {
      setSending(false);
    }
  };

  const remove = async (c: Comment) => {
    const ok = await confirm({ title: "Delete this comment?", confirmText: "Delete", danger: true });
    if (!ok) return;
    try {
      await deleteComment(c.id);
      setData((prev) => (prev ?? []).filter((x) => x.id !== c.id));
      onCountChange(-1);
    } catch (e) {
      toast.error(errorMessage(e, "Delete failed"));
    }
  };

  const toggleLike = async (c: Comment) => {
    const prev = { likeCount: c.likeCount, likedByMe: c.likedByMe };
    patch(c.id, { likedByMe: !c.likedByMe, likeCount: c.likeCount + (c.likedByMe ? -1 : 1) });
    try {
      patch(c.id, await toggleCommentLike(c.id));
    } catch {
      patch(c.id, prev);
      toast.error("Couldn't update like");
    }
  };

  return { comments: data ?? [], loading, text, setText, sending, send, remove, toggleLike };
}
