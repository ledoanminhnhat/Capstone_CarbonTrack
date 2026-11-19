"use client";

import { useRef, useState } from "react";
import { FaHeart, FaRegHeart, FaRegComment, FaRegPaperPlane } from "react-icons/fa6";
import Badge from "@/components/ui/Badge";
import AvatarGroup from "@/components/ui/AvatarGroup";
import { timeAgo } from "@/utils/date";
import type { Post } from "../types";
import AuthorAvatar from "./AuthorAvatar";
import PostMenu from "./PostMenu";
import PostCaption from "./PostCaption";
import PostComments from "./PostComments";
import { ImageCarousel, TextPostCard } from "./PostMedia";

/** "Liked by You and 4 others" / "Liked by Lan" */
function LikedBy({ post }: { post: Post }) {
  if (post.likeCount === 0) return <p className="m-0 text-muted text-[0.85rem]">Be the first to like this</p>;
  const first = post.likedByMe ? "you" : post.recentLikers[0]?.name;
  const others = post.likeCount - 1;
  return (
    <div className="flex items-center gap-2 text-[0.88rem] text-ink">
      <AvatarGroup people={post.recentLikers} max={3} size="xs" />
      {first ? (
        <span>
          Liked by <b>{first}</b>
          {others > 0 && (
            <>
              {" "}
              and <b>{others.toLocaleString()} other{others > 1 ? "s" : ""}</b>
            </>
          )}
        </span>
      ) : (
        <b>{post.likeCount.toLocaleString()} likes</b>
      )}
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} className="p-1.5 -m-1.5 text-ink hover:text-muted transition-colors">
      {children}
    </button>
  );
}

/** 1 bài đăng kiểu Instagram. */
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
  const commentInput = useRef<HTMLInputElement>(null);
  const [bounce, setBounce] = useState(0);
  const isMine = post.author.id === meId;
  const hasImages = post.imageUrls.length > 0;

  const like = () => {
    setBounce((b) => b + 1);
    onLike();
  };

  return (
    <article className={`bg-white rounded-2xl shadow-card overflow-hidden ${highlighted ? "ring-2 ring-brand-400" : ""}`}>
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3">
        <AuthorAvatar author={post.author} size="sm" />
        <div className="flex-1 min-w-0 flex items-baseline gap-1.5">
          <span className="text-ink font-semibold text-[0.9rem] truncate">{post.author.name}</span>
          {isMine && <span className="text-muted text-xs">· you</span>}
          <span className="text-muted text-xs whitespace-nowrap">• {timeAgo(post.createdAt)}</span>
        </div>
        {highlighted && (
          <Badge tone="brand" size="sm">
            Shared
          </Badge>
        )}
        <PostMenu canDelete={post.canDelete} canHide={!isMine} onDelete={onDelete} onHide={onHide} />
      </header>

      {/* Media: ảnh hoặc thẻ gradient cho bài chỉ có chữ */}
      {hasImages ? (
        <ImageCarousel urls={post.imageUrls} liked={post.likedByMe} onLike={like} />
      ) : (
        <TextPostCard content={post.content} liked={post.likedByMe} onLike={like} />
      )}

      <div className="px-4 pt-3 pb-4 flex flex-col gap-2.5">
        {/* Actions */}
        <div className="flex items-center gap-4">
          <IconBtn label={post.likedByMe ? "Unlike" : "Like"} onClick={like}>
            <span key={bounce} className="block" style={bounce ? { animation: "like-bounce 0.3s ease-out" } : undefined}>
              {post.likedByMe ? <FaHeart size={22} className="text-rose-500" /> : <FaRegHeart size={22} />}
            </span>
          </IconBtn>
          <IconBtn label="Comment" onClick={() => commentInput.current?.focus()}>
            <FaRegComment size={21} />
          </IconBtn>
          <IconBtn label="Share" onClick={onShare}>
            <FaRegPaperPlane size={20} />
          </IconBtn>
          {post.shareCount > 0 && (
            <span className="ml-auto text-muted text-xs">
              {post.shareCount} share{post.shareCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <LikedBy post={post} />

        {/* Caption (bài chữ đã hiện trong thẻ gradient) */}
        {hasImages && <PostCaption author={post.author.name} content={post.content} />}

        <PostComments
          ref={commentInput}
          postId={post.id}
          total={post.commentCount}
          preview={post.previewComments ?? []}
          onCountChange={onCommentCountChange}
        />
      </div>
    </article>
  );
}
