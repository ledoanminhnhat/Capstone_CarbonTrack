import type { Author, Comment, FeedPage, LeaderboardEntry, LikeResult, Post } from "../types";
import { request } from "@/services/http";

// ----- Posts -----
export const getFeed = (page = 0) => request<FeedPage>(`/api/posts?page=${page}`);

export const getPost = (id: string) => request<Post>(`/api/posts/${id}`);

export const createPost = (content: string, imageUrls: string[]) =>
  request<Post>("/api/posts", { method: "POST", body: { content, imageUrls } });

export const deletePost = (id: string) => request(`/api/posts/${id}`, { method: "DELETE" });

export const togglePostLike = (id: string) => request<LikeResult>(`/api/posts/${id}/like`, { method: "POST" });

export const sharePost = (id: string) =>
  request<{ shareCount: number }>(`/api/posts/${id}/share`, { method: "POST" });

// ----- Comments -----
export const getComments = (postId: string) => request<Comment[]>(`/api/posts/${postId}/comments`);

export const addComment = (postId: string, content: string) =>
  request<Comment>(`/api/posts/${postId}/comments`, { method: "POST", body: { content } });

export const deleteComment = (id: string) => request(`/api/comments/${id}`, { method: "DELETE" });

export const toggleCommentLike = (id: string) =>
  request<LikeResult>(`/api/comments/${id}/like`, { method: "POST" });

// ----- Ẩn người dùng -----
export const getMutedUsers = () => request<Author[]>("/api/users/me/muted");

export const muteUser = (id: string) => request(`/api/users/me/muted/${id}`, { method: "POST" });

export const unmuteUser = (id: string) => request(`/api/users/me/muted/${id}`, { method: "DELETE" });

// ----- Leaderboard -----
export const getLeaderboard = () => request<LeaderboardEntry[]>("/api/community/leaderboard");

// ----- Ai đã like (mới nhất trước) -----
export const getPostLikers = (postId: string) => request<Author[]>(`/api/posts/${postId}/likers`);

export const getCommentLikers = (commentId: string) => request<Author[]>(`/api/comments/${commentId}/likers`);
