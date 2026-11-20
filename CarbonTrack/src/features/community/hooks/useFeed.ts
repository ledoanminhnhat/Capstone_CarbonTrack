"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useShare } from "@/hooks/useShare";
import { getStoredUser } from "@/services/session";
import { errorMessage } from "@/utils/error";
import type { Post } from "../types";
import { deletePost, getFeed, getPost, sharePost, togglePostLike } from "../services/community.service";

/** Link chia sẻ 1 bài. */
export const postShareUrl = (id: string) => `${window.location.origin}/community?post=${id}`;

/** Feed Community: tải trang, thêm/xóa bài, like, share, bài được chia sẻ (?post=). */
export function useFeed() {
  const toast = useToast();
  const confirm = useConfirm();
  const share = useShare();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const feed = await getFeed(0);
      let list = feed.posts;
      // Link share dạng /community?post=<id>: đưa bài đó lên đầu
      const sharedId = new URLSearchParams(window.location.search).get("post");
      if (sharedId) {
        try {
          const shared = await getPost(sharedId);
          list = [shared, ...list.filter((p) => p.id !== sharedId)];
          setHighlightId(sharedId);
        } catch {
          /* bài đã bị xóa */
        }
      }
      setPosts(list);
      setPage(0);
      setHasMore(feed.hasMore);
    } catch (e) {
      setError(errorMessage(e, "Failed to load feed"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const feed = await getFeed(page + 1);
      setPosts((prev) => [...prev, ...feed.posts.filter((p) => !prev.some((x) => x.id === p.id))]);
      setPage(feed.page);
      setHasMore(feed.hasMore);
    } catch (e) {
      toast.error(errorMessage(e, "Failed to load more posts"));
    } finally {
      setLoadingMore(false);
    }
  };

  const updatePost = (id: string, patch: Partial<Post>) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const addPost = (p: Post) => setPosts((prev) => [p, ...prev]);

  const adjustCommentCount = (id: string, delta: number) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, commentCount: Math.max(0, p.commentCount + delta) } : p)));

  const removeByAuthor = (authorId: string) => setPosts((prev) => prev.filter((p) => p.author.id !== authorId));

  const remove = async (p: Post) => {
    const ok = await confirm({ title: "Delete this post?", message: "This cannot be undone.", confirmText: "Delete", danger: true });
    if (!ok) return;
    try {
      await deletePost(p.id);
      setPosts((prev) => prev.filter((x) => x.id !== p.id));
      toast.success("Post deleted");
    } catch (e) {
      toast.error(errorMessage(e, "Delete failed"));
    }
  };

  /** Like / bỏ like: cập nhật ngay, lỗi thì trả lại. */
  const toggleLike = async (p: Post) => {
    const prev = { likeCount: p.likeCount, likedByMe: p.likedByMe, recentLikers: p.recentLikers };
    const me = getStoredUser();
    // thêm / bỏ mình khỏi nhóm avatar ngay, server trả về danh sách chuẩn sau
    const recentLikers = p.likedByMe
      ? p.recentLikers.filter((a) => a.id !== me?.id)
      : me
        ? [{ id: me.id, name: me.name, avatarUrl: me.avatarUrl ?? null }, ...p.recentLikers].slice(0, 3)
        : p.recentLikers;
    updatePost(p.id, { likedByMe: !p.likedByMe, likeCount: p.likeCount + (p.likedByMe ? -1 : 1), recentLikers });
    try {
      updatePost(p.id, await togglePostLike(p.id));
    } catch {
      updatePost(p.id, prev);
      toast.error("Couldn't update like");
    }
  };

  const sharePostLink = async (p: Post) => {
    if (await share(postShareUrl(p.id), `${p.author.name} on CarbonTrack`)) {
      updatePost(p.id, await sharePost(p.id).catch(() => ({ shareCount: p.shareCount, sharedByMe: p.sharedByMe })));
    }
  };

  return {
    posts,
    loading,
    error,
    hasMore,
    loadingMore,
    loadMore,
    highlightId,
    reload,
    addPost,
    adjustCommentCount,
    removeByAuthor,
    remove,
    toggleLike,
    share: sharePostLink,
  };
}
