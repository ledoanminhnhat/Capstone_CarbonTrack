"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { MAX_POST_CONTENT, MAX_POST_IMAGES } from "@/constants/app";
import { uploadImage } from "@/services/upload.service";
import { errorMessage } from "@/utils/error";
import { validateImage } from "@/utils/image";
import type { Post } from "../types";
import { createPost } from "../services/community.service";

interface Picked {
  file: File;
  preview: string;
}

/** Soạn bài: nội dung, chọn ảnh (≤ 3, có preview), upload Cloudinary rồi đăng. */
export function usePostComposer(onPosted: (p: Post) => void) {
  const toast = useToast();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<Picked[]>([]);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const filesRef = useRef(files);
  filesRef.current = files;

  // dọn preview khi rời trang
  useEffect(() => () => filesRef.current.forEach((f) => URL.revokeObjectURL(f.preview)), []);

  /** Thêm ảnh (từ input hoặc kéo thả); bỏ qua file không phải ảnh hợp lệ. */
  const addFiles = (list: FileList | File[] | null) => {
    if (!list) return;
    setError("");
    const picked = Array.from(list);
    const room = MAX_POST_IMAGES - files.length;
    if (picked.length > room) setError(`You can attach up to ${MAX_POST_IMAGES} images.`);
    const accepted: Picked[] = [];
    for (const f of picked.slice(0, room)) {
      const err = validateImage(f);
      if (err) setError(err);
      else accepted.push({ file: f, preview: URL.createObjectURL(f) });
    }
    setFiles((prev) => [...prev, ...accepted]);
  };

  const removeFile = (i: number) =>
    setFiles((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });

  const tooLong = content.length > MAX_POST_CONTENT;
  const canPost = !posting && !tooLong && (!!content.trim() || files.length > 0);

  /** Xóa nháp (đóng modal). */
  const reset = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setContent("");
    setError("");
  };

  /** Trả về true nếu đăng thành công. */
  const submit = async (): Promise<boolean> => {
    if (!canPost) return false;
    setPosting(true);
    setError("");
    try {
      const urls = await Promise.all(files.map((f) => uploadImage(f.file, "post")));
      const post = await createPost(content.trim(), urls);
      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);
      setContent("");
      onPosted(post);
      toast.success("Posted!");
      return true;
    } catch (e) {
      setError(errorMessage(e, "Failed to post"));
      return false;
    } finally {
      setPosting(false);
    }
  };

  return {
    content,
    setContent,
    files,
    addFiles,
    removeFile,
    canAddMore: files.length < MAX_POST_IMAGES,
    posting,
    error,
    tooLong,
    canPost,
    submit,
    reset,
  };
}
