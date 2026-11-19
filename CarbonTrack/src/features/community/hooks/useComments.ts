"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { errorMessage } from "@/utils/error";
import type { Comment } from "../types";
import { addComment, deleteComment, getComments, toggleCommentLike } from "../services/community.service";

/**
 * Comment kiểu Instagram: ban đầu chỉ có vài comment xem trước (từ feed),
 * bấm "View all" mới tải hết. Gửi / xóa / like cập nhật tại chỗ.
 */
export function useComments(postId: string, preview: Comment[], onCountChange: (delta: number) => void) {
  const toast = useToast();
  const confirm = useConfirm();
  const [comments, setComments] = useState<Comment[]>(preview);
  const [expanded, setExpanded] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const patch = (id: string, p: Partial<Comment>) =>
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, ...p } : c)));

  const loadAll = async () => {
    setLoadingAll(true);
    try {
      setComments(await getComments(postId));
      setExpanded(true);
    } catch (e) {
      toast.error(errorMessage(e, "Failed to load comments"));
    } finally {
      setLoadingAll(false);
    }
  };

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const c = await addComment(postId, text.trim());
      setComments((prev) => [...prev, c]);
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
      setComments((prev) => prev.filter((x) => x.id !== c.id));
      onCountChange(-1);
    } catch (e) {
      toast.error(errorMessage(e, "Delete failed"));
    }
  };

  const toggleLike = async (c: Comment) => {
    const prev = { likeCount: c.likeCount, likedByMe: c.likedByMe };
    patch(c.id, { likedByMe: !c.likedByMe, likeCount: c.likeCount + (c.likedByMe ? -1 : 1) });
    try {
      const r = await toggleCommentLike(c.id);
      patch(c.id, { likeCount: r.likeCount, likedByMe: r.likedByMe });
    } catch {
      patch(c.id, prev);
      toast.error("Couldn't update like");
    }
  };

  return { comments, expanded, loadingAll, loadAll, text, setText, sending, send, remove, toggleLike };
}
