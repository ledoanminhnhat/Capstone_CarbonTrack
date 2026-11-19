// API Community: bài đăng, like, comment, share, ẩn người dùng, upload ảnh
import { authFetch } from "./auth";

export const MAX_CONTENT = 5000;
export const MAX_IMAGES = 3;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface Author {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  imageUrls: string[];
  likeCount: number;
  likedByMe: boolean;
  commentCount: number;
  shareCount: number;
  createdAt: string;
  canDelete: boolean;
}

export interface FeedPage {
  posts: Post[];
  page: number;
  hasMore: boolean;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt: string;
  canDelete: boolean;
  likeCount: number;
  likedByMe: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string | null;
  points: number;
}

async function readError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message || body.error || `Error ${res.status}`;
  } catch {
    return `Error ${res.status}`;
  }
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

async function ok(res: Response): Promise<void> {
  if (!res.ok) throw new Error(await readError(res));
}

// ----- Posts -----
export const getFeed = async (page = 0) => json<FeedPage>(await authFetch(`/api/posts?page=${page}`));

export const getPost = async (id: string) => json<Post>(await authFetch(`/api/posts/${id}`));

export const createPost = async (content: string, imageUrls: string[]) =>
  json<Post>(
    await authFetch("/api/posts", { method: "POST", body: JSON.stringify({ content, imageUrls }) })
  );

export const deletePost = async (id: string) =>
  ok(await authFetch(`/api/posts/${id}`, { method: "DELETE" }));

export const toggleLike = async (id: string) =>
  json<{ likeCount: number; likedByMe: boolean }>(
    await authFetch(`/api/posts/${id}/like`, { method: "POST" })
  );

export const sharePost = async (id: string) =>
  json<{ shareCount: number }>(await authFetch(`/api/posts/${id}/share`, { method: "POST" }));

// ----- Comments -----
export const getComments = async (postId: string) =>
  json<Comment[]>(await authFetch(`/api/posts/${postId}/comments`));

export const addComment = async (postId: string, content: string) =>
  json<Comment>(
    await authFetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
  );

export const deleteComment = async (id: string) =>
  ok(await authFetch(`/api/comments/${id}`, { method: "DELETE" }));

export const toggleCommentLike = async (id: string) =>
  json<{ likeCount: number; likedByMe: boolean }>(
    await authFetch(`/api/comments/${id}/like`, { method: "POST" })
  );

// ----- Mute (ẩn người dùng) -----
export const getMuted = async () => json<Author[]>(await authFetch("/api/users/me/muted"));

export const muteUser = async (id: string) =>
  ok(await authFetch(`/api/users/me/muted/${id}`, { method: "POST" }));

export const unmuteUser = async (id: string) =>
  ok(await authFetch(`/api/users/me/muted/${id}`, { method: "DELETE" }));

// ----- Leaderboard -----
export const getLeaderboard = async () =>
  json<LeaderboardEntry[]>(await authFetch("/api/community/leaderboard"));

// ----- Upload ảnh lên Cloudinary (signed) -----
interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
  transformation: string;
}

/** Kiểm tra file trước khi upload; trả về thông báo lỗi hoặc null. */
export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return `${file.name}: only JPG, PNG or WEBP`;
  if (file.size > MAX_IMAGE_BYTES) return `${file.name}: larger than 5MB`;
  return null;
}

/** Xin chữ ký từ backend rồi upload thẳng lên Cloudinary; trả về URL ảnh. */
export async function uploadImage(file: File, type: "post" | "avatar" = "post"): Promise<string> {
  const sig = await json<UploadSignature>(
    await authFetch(`/api/uploads/signature?type=${type}`, { method: "POST" })
  );
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);
  form.append("allowed_formats", sig.allowedFormats);
  form.append("transformation", sig.transformation);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error?.message || "Image upload failed");
  return body.secure_url as string;
}

/** "5 phút trước" kiểu ngắn gọn. */
export function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-GB");
}
