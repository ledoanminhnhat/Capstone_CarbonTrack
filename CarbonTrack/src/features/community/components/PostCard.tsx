"use client";

import React, { useState } from "react";
import { MdFavorite, MdFavoriteBorder, MdChatBubbleOutline, MdShare } from "react-icons/md";
import Badge from "@/components/ui/Badge";
import AvatarGroup from "@/components/ui/AvatarGroup";
import { timeAgo } from "@/utils/date";
import type { Post } from "../types";
import AuthorAvatar from "./AuthorAvatar";
import PostMenu from "./PostMenu";
import PostImages from "./PostImages";
import CommentSection from "./CommentSection";

const COLLAPSE_AT = 400;

/** "Lan and 4 others" / "You and Lan"… */
function likeLabel(p: Post): string {
  const first = p.likedByMe ? "You" : p.recentLikers[0]?.name;
  if (!first) return `${p.likeCount}`;
  const others = p.likeCount - 1;
  return others <= 0 ? first : `${first} and ${others} other${others > 1 ? "s" : ""}`;
}

function ActionBtn({ children, onClick, active = false }: { children: React.ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[0.9rem] font-semibold transition-colors hover:bg-gray-50 ${
        active ? "text-brand-600" : "text-muted"
      }`}
    >
      {children}
    </button>
  );
}

export default function PostCard({
  post,
  meId,
  highlighted,
  onLike,
  onShare,
  onDelete,
  onHide,
  onCommentCountChange,
}: {
  post: Post;
  meId: string;
  highlighted: boolean;
  onLike: () => void;
  onShare: () => void;
  onDelete: () => void;
  onHide: () => void;
  onCommentCountChange: (delta: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const isMine = post.author.id === meId;
  const long = post.content.length > COLLAPSE_AT;
  const text = long && !expanded ? post.content.slice(0, COLLAPSE_AT).trimEnd() + "…" : post.content;
  const hasStats = post.likeCount > 0 || post.commentCount > 0 || post.shareCount > 0;

  return (
    <article className={`bg-white rounded-2xl shadow-card p-5 ${highlighted ? "ring-2 ring-brand-400" : ""}`}>
      <header className="flex items-center gap-3 mb-3">
        <AuthorAvatar author={post.author} />
        <div className="flex-1 min-w-0">
          <div className="text-ink font-bold text-[0.95rem] truncate">
            {post.author.name}
            {isMine && <span className="text-muted font-normal"> · you</span>}
          </div>
          <div className="text-muted text-xs">{timeAgo(post.createdAt)}</div>
        </div>
        {highlighted && (
          <Badge tone="brand" size="sm" icon={<MdShare size={12} />}>
            Shared post
          </Badge>
        )}
        <PostMenu canDelete={post.canDelete} canHide={!isMine} onDelete={onDelete} onHide={onHide} />
      </header>

      {post.content && (
        <p className="m-0 text-ink text-[0.95rem] leading-relaxed whitespace-pre-wrap break-words">
          {text}
          {long && (
            <button onClick={() => setExpanded((v) => !v)} className="ml-1 text-brand-600 font-semibold hover:underline">
              {expanded ? "Show less" : "See more"}
            </button>
          )}
        </p>
      )}

      <PostImages urls={post.imageUrls} />

      {hasStats && (
        <div className="flex justify-between items-center text-muted text-xs mt-3">
          {post.likeCount > 0 ? (
            <span className="flex items-center gap-2">
              <AvatarGroup people={post.recentLikers} total={post.likeCount} size="xs" />
              <span>
                <MdFavorite size={12} className="inline text-rose-500 -mt-0.5" /> {likeLabel(post)}
              </span>
            </span>
          ) : (
            <span />
          )}
          <span className="flex gap-3">
            {post.commentCount > 0 && <span>{post.commentCount} comments</span>}
            {post.shareCount > 0 && <span>{post.shareCount} shares</span>}
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-1 mt-3 pt-2 border-t border-gray-100">
        <ActionBtn onClick={onLike} active={post.likedByMe}>
          {post.likedByMe ? <MdFavorite size={20} className="text-rose-500" /> : <MdFavoriteBorder size={20} />}
          Like
        </ActionBtn>
        <ActionBtn onClick={() => setShowComments((v) => !v)} active={showComments}>
          <MdChatBubbleOutline size={19} /> Comment
        </ActionBtn>
        <ActionBtn onClick={onShare}>
          <MdShare size={19} /> Share
        </ActionBtn>
      </div>

      {showComments && <CommentSection postId={post.id} onCountChange={onCommentCountChange} />}
    </article>
  );
}
