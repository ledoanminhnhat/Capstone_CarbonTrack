"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { FaArrowLeft, FaRegImages, FaXmark, FaPlus } from "react-icons/fa6";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { IMAGE_ACCEPT, MAX_POST_CONTENT, MAX_POST_IMAGES } from "@/constants/app";
import type { AuthUser } from "@/types";
import type { Post } from "../types";
import { usePostComposer } from "../hooks/usePostComposer";
import AuthorAvatar from "./AuthorAvatar";

type Step = "media" | "caption";

/**
 * "Create new post" kiểu Instagram:
 *  B1 chọn / kéo thả ảnh (có thể bỏ qua để đăng chữ) -> B2 xem trước + viết caption -> Share.
 */
export default function CreatePostModal({
  open,
  me,
  onClose,
  onPosted,
}: {
  open: boolean;
  me: AuthUser;
  onClose: () => void;
  onPosted: (p: Post) => void;
}) {
  const c = usePostComposer(onPosted);
  const [step, setStep] = useState<Step>("media");
  const [dragging, setDragging] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => {
    c.reset();
    setStep("media");
    setPreviewIdx(0);
    onClose();
  };

  const share = async () => {
    if (await c.submit()) close();
  };

  const pick = () => inputRef.current?.click();
  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={IMAGE_ACCEPT}
      multiple
      hidden
      onChange={(e) => {
        c.addFiles(e.target.files);
        e.target.value = "";
      }}
    />
  );

  const title =
    step === "media" ? (
      "Create new post"
    ) : (
      <span className="flex items-center gap-3">
        <button onClick={() => setStep("media")} disabled={c.posting} className="text-muted hover:text-ink" aria-label="Back">
          <FaArrowLeft size={16} />
        </button>
        {c.files.length ? "Write a caption" : "Text post"}
      </span>
    );

  return (
    <Modal open={open} onClose={close} title={title} maxWidth="max-w-[520px]" locked={c.posting}>
      {fileInput}

      {step === "media" ? (
        <>
          {c.files.length === 0 ? (
            // Vùng kéo thả
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                c.addFiles(Array.from(e.dataTransfer.files));
              }}
              className={`aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-colors ${
                dragging ? "border-brand-500 bg-brand-50" : "border-line-strong bg-subtle"
              }`}
            >
              <FaRegImages size={56} className="text-muted" />
              <p className="m-0 text-ink text-lg">Drag photos here</p>
              <p className="m-0 -mt-3 text-muted text-xs">JPG, PNG or WEBP · up to {MAX_POST_IMAGES} photos · max 5MB</p>
              <Button variant="gradient" size="sm" onClick={pick}>
                Select from computer
              </Button>
            </div>
          ) : (
            // Ảnh đã chọn
            <div className="grid grid-cols-3 gap-2">
              {c.files.map((f, i) => (
                <div key={f.preview} className="relative aspect-square rounded-xl overflow-hidden bg-soft">
                  <img src={f.preview} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => c.removeFile(i)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                    aria-label="Remove photo"
                  >
                    <FaXmark size={12} />
                  </button>
                </div>
              ))}
              {c.canAddMore && (
                <button
                  onClick={pick}
                  className="aspect-square rounded-xl border-2 border-dashed border-line-strong text-muted flex flex-col items-center justify-center gap-1 hover:border-brand-400 hover:text-brand-600"
                >
                  <FaPlus size={18} />
                  <span className="text-xs font-semibold">Add</span>
                </button>
              )}
            </div>
          )}

          <Alert className="mt-4">{c.error}</Alert>

          <div className="flex items-center justify-between mt-5">
            {c.files.length === 0 ? (
              <button onClick={() => setStep("caption")} className="text-muted text-sm hover:text-ink">
                Skip — post text only →
              </button>
            ) : (
              <span className="text-muted text-sm">
                {c.files.length}/{MAX_POST_IMAGES} photos
              </span>
            )}
            {c.files.length > 0 && (
              <Button variant="gradient" size="sm" onClick={() => setStep("caption")} className="px-6">
                Next
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Xem trước ảnh */}
          {c.files.length > 0 && (
            <div className="relative aspect-square rounded-xl overflow-hidden bg-soft mb-4">
              <img src={c.files[Math.min(previewIdx, c.files.length - 1)].preview} alt="" className="w-full h-full object-cover" />
              {c.files.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {c.files.map((f, i) => (
                    <button
                      key={f.preview}
                      onClick={() => setPreviewIdx(i)}
                      aria-label={`Photo ${i + 1}`}
                      className={`w-2 h-2 rounded-full ${i === previewIdx ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2.5 mb-3">
            <AuthorAvatar author={{ id: me.id, name: me.name, avatarUrl: me.avatarUrl ?? null }} size="sm" />
            <span className="font-semibold text-ink text-[0.9rem]">{me.name}</span>
          </div>
          {c.files.length ? (
            // Bài có ảnh: caption bình thường
            <textarea
              autoFocus
              value={c.content}
              onChange={(e) => c.setContent(e.target.value)}
              placeholder="Write a caption..."
              rows={3}
              className="w-full resize-none bg-transparent border border-line-strong rounded-xl px-4 py-3 text-[0.95rem] text-ink outline-none placeholder:text-muted focus:border-brand-500 transition-colors"
            />
          ) : (
            // Bài chỉ có chữ: gõ thẳng lên thẻ gradient -> thấy y như lúc đăng
            <div className="relative aspect-[4/3] rounded-2xl bg-gradient-brand flex items-center justify-center p-6 shadow-glow-brand">
              <textarea
                autoFocus
                value={c.content}
                onChange={(e) => c.setContent(e.target.value)}
                placeholder={`What green thing did you do today, ${me.name.split(" ")[0]}?`}
                className={`w-full h-full resize-none bg-transparent border-none outline-none text-white placeholder:text-white/60 font-bold text-center leading-snug flex items-center ${
                  c.content.length < 80 ? "text-2xl" : c.content.length < 180 ? "text-xl" : "text-base"
                }`}
                style={{ paddingTop: c.content.length < 80 ? "18%" : "4%" }}
              />
            </div>
          )}
          <div className="flex justify-end mt-2">
            <span className={`text-xs ${c.tooLong ? "text-rose-600 font-semibold" : "text-muted"}`}>
              {c.content.length.toLocaleString()}/{MAX_POST_CONTENT.toLocaleString()}
            </span>
          </div>

          <Alert className="mt-3">{c.error}</Alert>

          <Button variant="gradient" size="full" onClick={share} disabled={!c.canPost} className="mt-4">
            {c.posting ? (c.files.length ? "Uploading..." : "Sharing...") : "Share"}
          </Button>
        </>
      )}
    </Modal>
  );
}
