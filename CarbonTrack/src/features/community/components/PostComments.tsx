"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { FaHeart, FaRegHeart, FaXmark } from "react-icons/fa6";
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
  onReply,
  onShowLikers,
}: {
  c: Comment;
  onLike: () => void;
  onDelete: () => void;
  onReply: () => void;
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
          <button onClick={onReply} className="font-semibold hover:text-ink">
            Reply
          </button>
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

/**
 * Comment dưới bài: "View all N comments", vài comment xem trước, ô "Add a comment… Post".
 * Reply 2 tầng: reply nằm thụt dưới comment gốc, mặc định thu gọn ("View N replies").
 */
const PostComments = forwardRef<
  HTMLInputElement,
  { postId: string; total: number; preview: Comment[]; onCountChange: (delta: number) => void }
>(function PostComments({ postId, total, preview, onCountChange }, inputRef) {
  const c = useComments(postId, preview, onCountChange);
  const hidden = total - c.comments.length;
  const [likers, setLikers] = useState<LikersTarget | null>(null);

  // vừa dùng nội bộ (focus khi bấm Reply) vừa đưa ra ngoài cho PostCard
  const localInput = useRef<HTMLInputElement>(null);
  useImperativeHandle(inputRef, () => localInput.current as HTMLInputElement);

  const roots = c.comments.filter((x) => !x.parentId);
  const repliesOf = (id: string) => c.comments.filter((x) => x.parentId === id);

  const row = (cm: Comment) => (
    <CommentRow
      key={cm.id}
      c={cm}
      onLike={() => c.toggleLike(cm)}
      onDelete={() => c.remove(cm)}
      onReply={() => {
        c.startReply(cm);
        localInput.current?.focus();
      }}
      onShowLikers={() => setLikers({ kind: "comment", id: cm.id })}
    />
  );

  return (
    <div className="flex flex-col gap-2.5">
      {!c.expanded && hidden > 0 && (
        <button onClick={c.loadAll} disabled={c.loadingAll} className="text-left text-muted text-[0.88rem] hover:text-ink">
          {c.loadingAll ? "Loading..." : `View all ${total} comments`}
        </button>
      )}

      {roots.map((root) => {
        const replies = repliesOf(root.id);
        const count = c.expanded ? replies.length : root.replyCount;
        const open = c.openReplies.has(root.id);
        return (
          <div key={root.id} className="flex flex-col gap-2.5">
            {row(root)}
            {count > 0 && (
              <div className="ml-10 flex flex-col gap-2.5">
                {open && replies.map(row)}
                <button
                  onClick={() => (open ? c.hideReplies(root.id) : c.showReplies(root.id))}
                  disabled={c.loadingAll}
                  className="flex items-center gap-2 text-left text-muted text-[0.78rem] font-semibold hover:text-ink"
                >
                  <span className="w-6 border-t border-line-strong" />
                  {open ? "Hide replies" : `View ${count} repl${count > 1 ? "ies" : "y"}`}
                </button>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex flex-col gap-1.5 border-t border-line pt-3 mt-1">
        {c.replyTo && (
          <div className="flex items-center justify-between text-[0.75rem] text-muted">
            <span>
              Replying to <strong className="text-ink">{c.replyTo.name}</strong>
            </span>
            <button onClick={c.cancelReply} className="hover:text-ink p-0.5" aria-label="Cancel reply">
              <FaXmark size={11} />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            ref={localInput}
            value={c.text}
            onChange={(e) => c.setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) c.send();
              if (e.key === "Escape" && c.replyTo) c.cancelReply();
            }}
            maxLength={MAX_COMMENT_LENGTH}
            placeholder={c.replyTo ? `Reply to ${c.replyTo.name}...` : "Add a comment..."}
            className="flex-1 bg-transparent text-[0.9rem] text-ink outline-none placeholder:text-muted"
          />
          {c.text.trim() && (
            <button onClick={c.send} disabled={c.sending} className="text-brand-600 font-semibold text-[0.9rem] hover:text-brand-700 disabled:opacity-50">
              {c.sending ? "Posting..." : "Post"}
            </button>
          )}
        </div>
      </div>

      <LikersModal target={likers} onClose={() => setLikers(null)} />
    </div>
  );
});

export default PostComments;
