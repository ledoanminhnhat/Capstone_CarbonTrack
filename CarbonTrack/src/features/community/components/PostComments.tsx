"use client";

import { forwardRef, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { MAX_COMMENT_LENGTH } from "@/constants/app";
import { timeAgo } from "@/utils/date";
import type { Comment } from "../types";
import { useComments } from "../hooks/useComments";
import AuthorAvatar from "./AuthorAvatar";
import LikersModal from "./LikersModal";
import type { LikersTarget } from "../hooks/useLikers";

function CommentRow({
  c,
  onLike,
  onDelete,
  onShowLikers,
}: {
  c: Comment;
  onLike: () => void;
  onDelete: () => void;
  onShowLikers: () => void;
}) {
  return (
    <div className="flex gap-2.5 items-start group">
      <AuthorAvatar author={c.author} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="m-0 text-ink text-[0.88rem] leading-snug whitespace-pre-wrap break-words">
          <span className="font-semibold mr-1.5">{c.author.name}</span>
          {c.content}
        </p>
        <div className="flex gap-3 text-[0.75rem] text-muted mt-0.5">
          <span>{timeAgo(c.createdAt)}</span>
          {c.likeCount > 0 && (
            <button onClick={onShowLikers} className="font-semibold hover:text-ink hover:underline" title="See who liked this">
              {c.likeCount} like{c.likeCount > 1 ? "s" : ""}
            </button>
          )}
          {c.canDelete && (
            <button onClick={onDelete} className="font-semibold hover:text-rose-600 opacity-0 group-hover:opacity-100">
              Delete
            </button>
          )}
        </div>
      </div>
      <button onClick={onLike} className="pt-1 text-muted hover:text-ink" aria-label={c.likedByMe ? "Unlike comment" : "Like comment"}>
        {c.likedByMe ? <FaHeart size={12} className="text-rose-500" /> : <FaRegHeart size={12} />}
      </button>
    </div>
  );
}

/** Comment dưới bài: "View all N comments", vài comment xem trước, ô "Add a comment… Post". */
const PostComments = forwardRef<
  HTMLInputElement,
  { postId: string; total: number; preview: Comment[]; onCountChange: (delta: number) => void }
>(function PostComments({ postId, total, preview, onCountChange }, inputRef) {
  const c = useComments(postId, preview, onCountChange);
  const hidden = total - c.comments.length;
  const [likers, setLikers] = useState<LikersTarget | null>(null);

  return (
    <div className="flex flex-col gap-2.5">
      {!c.expanded && hidden > 0 && (
        <button onClick={c.loadAll} disabled={c.loadingAll} className="text-left text-muted text-[0.88rem] hover:text-ink">
          {c.loadingAll ? "Loading..." : `View all ${total} comments`}
        </button>
      )}

      {c.comments.map((cm) => (
        <CommentRow
          key={cm.id}
          c={cm}
          onLike={() => c.toggleLike(cm)}
          onDelete={() => c.remove(cm)}
          onShowLikers={() => setLikers({ kind: "comment", id: cm.id })}
        />
      ))}

      <div className="flex items-center gap-2 border-t border-line pt-3 mt-1">
        <input
          ref={inputRef}
          value={c.text}
          onChange={(e) => c.setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && c.send()}
          maxLength={MAX_COMMENT_LENGTH}
          placeholder="Add a comment..."
          className="flex-1 bg-transparent text-[0.9rem] text-ink outline-none placeholder:text-muted"
        />
        {c.text.trim() && (
          <button onClick={c.send} disabled={c.sending} className="text-brand-600 font-semibold text-[0.9rem] hover:text-brand-700 disabled:opacity-50">
            {c.sending ? "Posting..." : "Post"}
          </button>
        )}
      </div>

      <LikersModal target={likers} onClose={() => setLikers(null)} />
    </div>
  );
});

export default PostComments;
