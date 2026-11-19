"use client";

import { useState } from "react";
import { FaRegImages } from "react-icons/fa6";
import type { AuthUser } from "@/types";
import type { Post } from "../types";
import AuthorAvatar from "./AuthorAvatar";
import CreatePostModal from "./CreatePostModal";

/** Ô "What green thing…" trên đầu feed; bấm vào mở modal Create new post. */
export default function CreatePostPrompt({ me, onPosted }: { me: AuthUser; onPosted: (p: Post) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-3">
        <AuthorAvatar author={{ id: me.id, name: me.name, avatarUrl: me.avatarUrl ?? null }} size="sm" />
        <button
          onClick={() => setOpen(true)}
          className="flex-1 text-left text-muted text-[0.9rem] bg-gray-50 hover:bg-gray-100 rounded-full px-4 py-2.5 transition-colors"
        >
          What green thing did you do today, {me.name.split(" ")[0]}?
        </button>
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-brand-600 hover:bg-brand-50"
          aria-label="Add photos"
        >
          <FaRegImages size={19} />
        </button>
      </div>

      <CreatePostModal open={open} me={me} onClose={() => setOpen(false)} onPosted={onPosted} />
    </>
  );
}
