"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { errorMessage } from "@/utils/error";
import type { Comment } from "../types";
import { addComment, deleteComment, getComments, toggleCommentLike } from "../services/community.service";

/** Đang trả lời ai: reply luôn gắn vào comment gốc (chỉ 2 tầng). */
export interface ReplyTarget {
  parentId: string;
  name: string;
}

/**
 * Comment kiểu Instagram: ban đầu chỉ có vài comment xem trước (từ feed),
 * bấm "View all" mới tải hết. Gửi / xóa / like cập nhật tại chỗ.
 * Reply 2 tầng: comment gốc -> các reply, reply mặc định thu gọn.
 */
export function useComments(postId: string, preview: Comment[], onCountChange: (delta: number) => void) {
  const toast = useToast();
  const confirm = useConfirm();
  const [comments, setComments] = useState<Comment[]>(preview);
  const [expanded, setExpanded] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);
  const [openReplies, setOpenReplies] = useState<Set<string>>(new Set());

  const patch = (id: string, p: Partial<Comment>) =>
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, ...p } : c)));

  const bumpReplyCount = (parentId: string, delta: number) =>
    setComments((prev) =>
      prev.map((c) => (c.id === parentId ? { ...c, replyCount: Math.max(0, c.replyCount + delta) } : c)),
    );

  const openThread = (parentId: string) => setOpenReplies((prev) => new Set(prev).add(parentId));

  const loadAll = async () => {
    setLoadingAll(true);
    try {
      setComments(await getComments(postId));
      setExpanded(true);
      return true;
    } catch (e) {
      toast.error(errorMessage(e, "Failed to load comments"));
      return false;
    } finally {
      setLoadingAll(false);
    }
  };

  /** Mở reply của 1 comment gốc (chưa tải hết thì tải trước). */
  const showReplies = async (parentId: string) => {
    if (!expanded && !(await loadAll())) return;
    openThread(parentId);
  };

  const hideReplies = (parentId: string) =>
    setOpenReplies((prev) => {
      const next = new Set(prev);
      next.delete(parentId);
      return next;
    });

  /** Bấm Reply: trả lời 1 reply thì gắn vào comment gốc của nó + chèn @tên. */
  const startReply = (c: Comment) => {
    setReplyTo({ parentId: c.parentId ?? c.id, name: c.author.name });
    if (c.parentId) setText(`@${c.author.name} `);
  };

  const cancelReply = () => {
    setReplyTo(null);
    setText("");
  };

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const parentId = replyTo?.parentId;
      const c = await addComment(postId, text.trim(), parentId);
      setComments((prev) => [...prev, c]);
      if (c.parentId) {
        bumpReplyCount(c.parentId, 1);
        if (!expanded) await showReplies(c.parentId); // tải hết để thấy cả thread
        else openThread(c.parentId);
      }
      setText("");
      setReplyTo(null);
      onCountChange(1);
    } catch (e) {
      toast.error(errorMessage(e, "Failed to comment"));
    } finally {
      setSending(false);
    }
  };

  const remove = async (c: Comment) => {
    const isRoot = !c.parentId;
    const ok = await confirm({
      title: "Delete this comment?",
      message: isRoot && c.replyCount > 0 ? "Its replies will be deleted too." : undefined,
      confirmText: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      const r = await deleteComment(c.id);
      setComments((prev) => prev.filter((x) => x.id !== c.id && x.parentId !== c.id));
      if (c.parentId) bumpReplyCount(c.parentId, -1);
      if (replyTo?.parentId === c.id) setReplyTo(null);
      onCountChange(-(r?.deleted ?? 1));
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

  return {
    comments, expanded, loadingAll, loadAll, text, setText, sending, send, remove, toggleLike,
    replyTo, startReply, cancelReply, openReplies, showReplies, hideReplies,
  };
}
