"use client";

import { MdFavorite, MdSend } from "react-icons/md";
import { MAX_COMMENT_LENGTH } from "@/constants/app";
import { timeAgo } from "@/utils/date";
import { useComments } from "../hooks/useComments";
import AuthorAvatar from "./AuthorAvatar";

/** Danh sách comment + ô viết comment. */
export default function CommentSection({
  postId,
  onCountChange,
}: {
  postId: string;
  onCountChange: (delta: number) => void;
}) {
  const c = useComments(postId, onCountChange);

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3">
      {c.loading ? (
        <p className="text-muted text-sm m-0">Loading comments...</p>
      ) : (
        c.comments.map((cm) => (
          <div key={cm.id} className="flex gap-2">
            <AuthorAvatar author={cm.author} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="rounded-2xl px-4 py-2 inline-block max-w-full relative bg-gray-50">
                <div className="text-ink font-semibold text-[0.85rem]">{cm.author.name}</div>
                <div className="text-ink text-[0.9rem] whitespace-pre-wrap break-words">{cm.content}</div>
                {cm.likeCount > 0 && (
                  <span className="absolute -bottom-2.5 -right-2 bg-white shadow-soft rounded-full px-1.5 py-0.5 text-[0.7rem] text-ink flex items-center gap-0.5">
                    <MdFavorite size={12} className="text-rose-500" /> {cm.likeCount}
                  </span>
                )}
              </div>
              <div className="flex gap-3 text-xs text-muted mt-1 ml-3 items-center">
                <span>{timeAgo(cm.createdAt)}</span>
                <button
                  onClick={() => c.toggleLike(cm)}
                  className={`font-semibold hover:underline ${cm.likedByMe ? "text-rose-500" : ""}`}
                >
                  {cm.likedByMe ? "Liked" : "Like"}
                </button>
                {cm.canDelete && (
                  <button onClick={() => c.remove(cm)} className="hover:text-rose-600 font-semibold">
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      <div className="flex gap-2 items-center">
        <input
          value={c.text}
          onChange={(e) => c.setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && c.send()}
          maxLength={MAX_COMMENT_LENGTH}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-[0.9rem] outline-none focus:border-brand-500"
        />
        <button
          onClick={c.send}
          disabled={c.sending || !c.text.trim()}
          className="w-10 h-10 rounded-full bg-gradient-brand text-white flex items-center justify-center disabled:opacity-40"
          aria-label="Send comment"
        >
          <MdSend size={18} />
        </button>
      </div>
    </div>
  );
}
