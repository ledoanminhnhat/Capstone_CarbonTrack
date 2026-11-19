"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef } from "react";
import { MdClose, MdImage } from "react-icons/md";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { IMAGE_ACCEPT, MAX_POST_CONTENT, MAX_POST_IMAGES } from "@/constants/app";
import type { AuthUser } from "@/types";
import type { Post } from "../types";
import { usePostComposer } from "../hooks/usePostComposer";
import AuthorAvatar from "./AuthorAvatar";

/** Khung đăng bài. */
export default function Composer({ me, onPosted }: { me: AuthUser; onPosted: (p: Post) => void }) {
  const c = usePostComposer(onPosted);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className="flex gap-3">
        <AuthorAvatar author={{ id: me.id, name: me.name, avatarUrl: me.avatarUrl ?? null }} />
        <textarea
          value={c.content}
          onChange={(e) => c.setContent(e.target.value)}
          placeholder={`What green thing did you do today, ${me.name.split(" ")[0]}?`}
          rows={3}
          className="flex-1 resize-y min-h-[80px] border border-gray-200 rounded-xl px-4 py-3 text-[0.95rem] text-ink outline-none focus:border-brand-500 transition-colors"
        />
      </div>

      {c.files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4 ml-14">
          {c.files.map((f, i) => (
            <div key={f.preview} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img src={f.preview} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => c.removeFile(i)}
                disabled={c.posting}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                aria-label="Remove image"
              >
                <MdClose size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Alert className="mt-3 ml-14">{c.error}</Alert>

      <div className="flex items-center justify-between mt-4 ml-14">
        <div className="flex items-center gap-3">
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
          <button
            onClick={() => inputRef.current?.click()}
            disabled={!c.canAddMore || c.posting}
            className="flex items-center gap-1.5 text-brand-600 font-semibold text-[0.9rem] px-3 py-2 rounded-lg hover:bg-brand-50 disabled:opacity-40 disabled:pointer-events-none"
          >
            <MdImage size={20} /> Photo {c.files.length > 0 && `(${c.files.length}/${MAX_POST_IMAGES})`}
          </button>
          <span className={`text-xs ${c.tooLong ? "text-rose-600 font-semibold" : "text-muted"}`}>
            {c.content.length.toLocaleString()}/{MAX_POST_CONTENT.toLocaleString()}
          </span>
        </div>
        <Button variant="gradient" size="sm" onClick={c.submit} disabled={!c.canPost} className="px-5">
          {c.posting ? (c.files.length ? "Uploading..." : "Posting...") : "Post"}
        </Button>
      </div>
    </div>
  );
}
