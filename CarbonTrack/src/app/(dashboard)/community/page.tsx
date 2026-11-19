"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdChatBubbleOutline,
  MdShare,
  MdImage,
  MdClose,
  MdMoreHoriz,
  MdDelete,
  MdVisibilityOff,
  MdSend,
  MdEmojiEvents,
} from "react-icons/md";
import { getUser } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import UiAvatar from "@/components/ui/Avatar";
import {
  MAX_CONTENT,
  MAX_IMAGES,
  getFeed,
  getPost,
  createPost,
  deletePost,
  toggleLike,
  sharePost,
  getComments,
  addComment,
  deleteComment,
  toggleCommentLike,
  getMuted,
  muteUser,
  unmuteUser,
  getLeaderboard,
  uploadImage,
  validateImage,
  timeAgo,
  type Post,
  type Comment,
  type Author,
  type LeaderboardEntry,
} from "@/lib/community";

function Avatar({ author, size = "md" }: { author: Author; size?: "sm" | "md" }) {
  return <UiAvatar id={author.id} name={author.name} avatarUrl={author.avatarUrl} size={size} />;
}

export default function CommunityPage() {
  const [me, setMe] = useState<{ id: string; name: string; avatarUrl?: string | null; isAdmin: boolean } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [muted, setMuted] = useState<Author[]>([]);
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const u = getUser();
    if (u) setMe({ id: u.id, name: u.name, avatarUrl: u.avatarUrl, isAdmin: u.role === "ADMIN" });

    (async () => {
      try {
        const feed = await getFeed(0);
        let list = feed.posts;
        // Link share dạng /community?post=<id>: đưa bài đó lên đầu
        const sharedId = new URLSearchParams(window.location.search).get("post");
        if (sharedId) {
          try {
            const shared = await getPost(sharedId);
            list = [shared, ...list.filter((p) => p.id !== sharedId)];
            setHighlightId(sharedId);
          } catch {
            /* bài đã bị xóa */
          }
        }
        setPosts(list);
        setHasMore(feed.hasMore);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load feed");
      } finally {
        setLoading(false);
      }
    })();
    getMuted().then(setMuted).catch(() => {});
    getLeaderboard().then(setLeaders).catch(() => {});
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const feed = await getFeed(page + 1);
      setPosts((prev) => [...prev, ...feed.posts.filter((p) => !prev.some((x) => x.id === p.id))]);
      setPage(feed.page);
      setHasMore(feed.hasMore);
    } catch {
      /* ignore */
    } finally {
      setLoadingMore(false);
    }
  };

  const updatePost = (id: string, patch: Partial<Post>) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const handleDelete = async (p: Post) => {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(p.id);
      setPosts((prev) => prev.filter((x) => x.id !== p.id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const handleMute = async (author: Author) => {
    if (!confirm(`Hide posts and comments from ${author.name}? You can undo this anytime.`)) return;
    try {
      await muteUser(author.id);
      setPosts((prev) => prev.filter((x) => x.author.id !== author.id));
      setMuted((prev) => [...prev, author]);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
  };

  const handleUnmute = async (author: Author) => {
    try {
      await unmuteUser(author.id);
      setMuted((prev) => prev.filter((m) => m.id !== author.id));
      // tải lại trang đầu để bài của họ hiện lại
      const feed = await getFeed(0);
      setPosts(feed.posts);
      setPage(0);
      setHasMore(feed.hasMore);
    } catch {
      /* ignore */
    }
  };

  return (
    <div>
      <PageHeader
        title="Green Community"
        subtitle="Share your eco wins, tips and photos with other CarbonTrack members."
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="flex flex-col gap-6 min-w-0">
          {me && <Composer me={me} onPosted={(p) => setPosts((prev) => [p, ...prev])} />}

          {error && <p className="text-sm rounded-xl px-4 py-3 bg-rose-50 text-rose-600 m-0">{error}</p>}

          {loading ? (
            <p className="text-muted text-center py-10">Loading feed...</p>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card p-10 text-center text-muted">
              <div className="text-4xl mb-3">🌍</div>
              No posts yet. Be the first to share something!
            </div>
          ) : (
            posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                meId={me?.id ?? ""}
                highlighted={p.id === highlightId}
                onChange={(patch) => updatePost(p.id, patch)}
                onDelete={() => handleDelete(p)}
                onMute={() => handleMute(p.author)}
              />
            ))
          )}

          {hasMore && (
            <Button variant="outline" onClick={loadMore} disabled={loadingMore} className="self-center">
              {loadingMore ? "Loading..." : "Load more"}
            </Button>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 xl:sticky xl:top-0">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="m-0 mb-4 text-ink text-[1.1rem] font-bold flex items-center gap-2">
              <MdEmojiEvents className="text-amber-500" size={22} /> Leaderboard
            </h3>
            {leaders.length === 0 ? (
              <p className="text-muted text-sm m-0">No points yet. Complete challenges to rank!</p>
            ) : (
              <ol className="m-0 p-0 list-none flex flex-col gap-3">
                {leaders.map((l, i) => (
                  <li key={l.id} className="flex items-center gap-3">
                    <span
                      className={`w-6 text-center font-extrabold ${
                        i === 0 ? "text-amber-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-orange-400" : "text-muted"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <Avatar author={{ id: l.id, name: l.name, avatarUrl: l.avatarUrl }} size="sm" />
                    <span className="flex-1 text-ink font-semibold text-[0.9rem] truncate">
                      {l.name}
                      {l.id === me?.id && <span className="text-muted font-normal"> (you)</span>}
                    </span>
                    <span className="text-brand-600 font-bold text-[0.85rem]">{l.points.toLocaleString()}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="bg-gradient-ocean text-white rounded-2xl p-6 shadow-glow-ocean">
            <h3 className="m-0 mb-2 text-[1.05rem] font-bold">Community guidelines 🌿</h3>
            <p className="m-0 text-white/90 text-[0.9rem] leading-relaxed">
              Be kind, share real experiences, and help each other live greener. Don&apos;t want to
              see someone? Use <b>Hide user</b> from the ••• menu.
            </p>
          </div>

          {muted.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="m-0 mb-4 text-ink text-[1.05rem] font-bold flex items-center gap-2">
                Hidden users <Badge tone="neutral">{muted.length}</Badge>
              </h3>
              <ul className="m-0 p-0 list-none flex flex-col gap-3">
                {muted.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
                    <Avatar author={m} size="sm" />
                    <span className="flex-1 text-ink text-[0.9rem] truncate">{m.name}</span>
                    <button
                      onClick={() => handleUnmute(m)}
                      className="text-brand-600 text-[0.8rem] font-semibold hover:underline"
                    >
                      Unhide
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ================= Soạn bài ================= */
function Composer({ me, onPosted }: { me: { id: string; name: string; avatarUrl?: string | null }; onPosted: (p: Post) => void }) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
  const [posting, setPosting] = useState(false);
  const [msg, setMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // dọn object URL khi gỡ component
  useEffect(() => () => files.forEach((f) => URL.revokeObjectURL(f.preview)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const pickFiles = (list: FileList | null) => {
    if (!list) return;
    setMsg("");
    const picked = Array.from(list);
    const room = MAX_IMAGES - files.length;
    if (picked.length > room) setMsg(`You can attach up to ${MAX_IMAGES} images.`);
    const accepted: { file: File; preview: string }[] = [];
    for (const f of picked.slice(0, room)) {
      const err = validateImage(f);
      if (err) {
        setMsg(err);
        continue;
      }
      accepted.push({ file: f, preview: URL.createObjectURL(f) });
    }
    setFiles((prev) => [...prev, ...accepted]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (i: number) =>
    setFiles((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });

  const submit = async () => {
    if (!content.trim() && files.length === 0) return;
    setPosting(true);
    setMsg("");
    try {
      const urls = await Promise.all(files.map((f) => uploadImage(f.file)));
      const post = await createPost(content.trim(), urls);
      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);
      setContent("");
      onPosted(post);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed to post");
    } finally {
      setPosting(false);
    }
  };

  const over = content.length > MAX_CONTENT;

  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className="flex gap-3">
        <Avatar author={{ id: me.id, name: me.name, avatarUrl: me.avatarUrl ?? null }} />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What green thing did you do today, ${me.name.split(" ")[0]}?`}
          rows={3}
          className="flex-1 resize-y min-h-[80px] border border-gray-200 rounded-xl px-4 py-3 text-[0.95rem] text-ink outline-none focus:border-brand-500 transition-colors"
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4 ml-14">
          {files.map((f, i) => (
            <div key={f.preview} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.preview} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeFile(i)}
                disabled={posting}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                aria-label="Remove image"
              >
                <MdClose size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {msg && <p className="text-sm rounded-lg px-3 py-2 bg-rose-50 text-rose-600 mt-3 mb-0 ml-14">{msg}</p>}

      <div className="flex items-center justify-between mt-4 ml-14">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            onChange={(e) => pickFiles(e.target.files)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={files.length >= MAX_IMAGES || posting}
            className="flex items-center gap-1.5 text-brand-600 font-semibold text-[0.9rem] px-3 py-2 rounded-lg hover:bg-brand-50 disabled:opacity-40 disabled:pointer-events-none"
          >
            <MdImage size={20} /> Photo {files.length > 0 && `(${files.length}/${MAX_IMAGES})`}
          </button>
          <span className={`text-xs ${over ? "text-rose-600 font-semibold" : "text-muted"}`}>
            {content.length.toLocaleString()}/{MAX_CONTENT.toLocaleString()}
          </span>
        </div>
        <Button
          variant="gradient"
          size="sm"
          onClick={submit}
          disabled={posting || over || (!content.trim() && files.length === 0)}
          className="px-5 disabled:opacity-50"
        >
          {posting ? (files.length ? "Uploading..." : "Posting...") : "Post"}
        </Button>
      </div>
    </div>
  );
}

/* ================= 1 bài đăng ================= */
const COLLAPSE_AT = 400;

function PostCard({
  post,
  meId,
  highlighted,
  onChange,
  onDelete,
  onMute,
}: {
  post: Post;
  meId: string;
  highlighted: boolean;
  onChange: (patch: Partial<Post>) => void;
  onDelete: () => void;
  onMute: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const isMine = post.author.id === meId;
  const long = post.content.length > COLLAPSE_AT;
  const text = long && !expanded ? post.content.slice(0, COLLAPSE_AT).trimEnd() + "…" : post.content;

  const like = async () => {
    // cập nhật ngay cho mượt, sai thì trả lại
    const prev = { likeCount: post.likeCount, likedByMe: post.likedByMe };
    onChange({ likedByMe: !prev.likedByMe, likeCount: prev.likeCount + (prev.likedByMe ? -1 : 1) });
    try {
      onChange(await toggleLike(post.id));
    } catch {
      onChange(prev);
    }
  };

  const share = async () => {
    const url = `${window.location.origin}/community?post=${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${post.author.name} on CarbonTrack`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setToast("Link copied!");
        setTimeout(() => setToast(""), 2000);
      }
      onChange(await sharePost(post.id));
    } catch {
      /* người dùng hủy share */
    }
  };

  const imgs = post.imageUrls;
  const grid =
    imgs.length === 1 ? "grid-cols-1" : imgs.length === 2 ? "grid-cols-2" : "grid-cols-2 grid-rows-2";

  return (
    <article
      className={`bg-white rounded-2xl shadow-card p-5 ${highlighted ? "ring-2 ring-brand-400" : ""}`}
    >
      <header className="flex items-center gap-3 mb-3">
        <Avatar author={post.author} />
        <div className="flex-1 min-w-0">
          <div className="text-ink font-bold text-[0.95rem] truncate">
            {post.author.name}
            {isMine && <span className="text-muted font-normal"> · you</span>}
          </div>
          <div className="text-muted text-xs">{timeAgo(post.createdAt)}</div>
        </div>
        {highlighted && <Badge tone="success">Shared post</Badge>}
        {(post.canDelete || !isMine) && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:bg-gray-100"
              aria-label="More options"
            >
              <MdMoreHoriz size={22} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-10 z-10 bg-white rounded-xl shadow-card border border-gray-100 py-1 w-44">
                {post.canDelete && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-[0.9rem] text-rose-600 hover:bg-rose-50"
                  >
                    <MdDelete size={18} /> Delete post
                  </button>
                )}
                {!isMine && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onMute();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-[0.9rem] text-ink hover:bg-gray-50"
                  >
                    <MdVisibilityOff size={18} /> Hide user
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {post.content && (
        <p className="m-0 text-ink text-[0.95rem] leading-relaxed whitespace-pre-wrap break-words">
          {text}
          {long && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="ml-1 text-brand-600 font-semibold hover:underline"
            >
              {expanded ? "Show less" : "See more"}
            </button>
          )}
        </p>
      )}

      {imgs.length > 0 && (
        <div className={`grid ${grid} gap-2 mt-3 rounded-xl overflow-hidden ${imgs.length > 1 ? "h-[320px]" : ""}`}>
          {imgs.map((url, i) => (
            <button
              key={url}
              onClick={() => setLightbox(url)}
              className={`block bg-gray-100 overflow-hidden ${imgs.length === 3 && i === 0 ? "row-span-2" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className={`w-full ${imgs.length === 1 ? "max-h-[480px] object-contain bg-gray-50" : "h-full object-cover"}`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Số liệu */}
      {(post.likeCount > 0 || post.commentCount > 0 || post.shareCount > 0) && (
        <div className="flex justify-between text-muted text-xs mt-3">
          <span>{post.likeCount > 0 && `❤️ ${post.likeCount}`}</span>
          <span className="flex gap-3">
            {post.commentCount > 0 && <span>{post.commentCount} comments</span>}
            {post.shareCount > 0 && <span>{post.shareCount} shares</span>}
          </span>
        </div>
      )}

      {/* Nút hành động */}
      <div className="grid grid-cols-3 gap-1 mt-3 pt-2 border-t border-gray-100 relative">
        <ActionBtn onClick={like} active={post.likedByMe}>
          {post.likedByMe ? <MdFavorite size={20} className="text-rose-500" /> : <MdFavoriteBorder size={20} />}
          Like
        </ActionBtn>
        <ActionBtn onClick={() => setShowComments((v) => !v)} active={showComments}>
          <MdChatBubbleOutline size={19} /> Comment
        </ActionBtn>
        <ActionBtn onClick={share}>
          <MdShare size={19} /> Share
        </ActionBtn>
        {toast && (
          <span className="absolute right-0 -top-8 bg-ink text-white text-xs px-3 py-1.5 rounded-lg">{toast}</span>
        )}
      </div>

      {showComments && (
        <CommentSection
          postId={post.id}
          onCountChange={(d) => onChange({ commentCount: Math.max(0, post.commentCount + d) })}
        />
      )}

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-xl" />
          <button
            className="absolute top-5 right-5 text-white"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <MdClose size={30} />
          </button>
        </div>
      )}
    </article>
  );
}

function ActionBtn({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
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

/* ================= Bình luận ================= */
function CommentSection({
  postId,
  onCountChange,
}: {
  postId: string;
  onCountChange: (delta: number) => void;
}) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getComments(postId).then(setComments).catch(() => setComments([]));
  }, [postId]);

  const patch = (id: string, p: Partial<Comment>) =>
    setComments((prev) => (prev ?? []).map((c) => (c.id === id ? { ...c, ...p } : c)));

  const like = async (c: Comment) => {
    const prev = { likeCount: c.likeCount, likedByMe: c.likedByMe };
    patch(c.id, { likedByMe: !prev.likedByMe, likeCount: prev.likeCount + (prev.likedByMe ? -1 : 1) });
    try {
      patch(c.id, await toggleCommentLike(c.id));
    } catch {
      patch(c.id, prev);
    }
  };


  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const c = await addComment(postId, text.trim());
      setComments((prev) => [...(prev ?? []), c]);
      setText("");
      onCountChange(1);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to comment");
    } finally {
      setSending(false);
    }
  };

  const remove = async (c: Comment) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await deleteComment(c.id);
      setComments((prev) => (prev ?? []).filter((x) => x.id !== c.id));
      onCountChange(-1);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3">
      {comments === null ? (
        <p className="text-muted text-sm m-0">Loading comments...</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="flex gap-2 group">
            <Avatar author={c.author} size="sm" />
            <div className="flex-1 min-w-0">
              <div
                className="rounded-2xl px-4 py-2 inline-block max-w-full relative bg-gray-50"
              >
                <div className="text-ink font-semibold text-[0.85rem]">{c.author.name}</div>
                <div className="text-ink text-[0.9rem] whitespace-pre-wrap break-words">{c.content}</div>
                {c.likeCount > 0 && (
                  <span className="absolute -bottom-2.5 -right-2 bg-white shadow-soft rounded-full px-1.5 py-0.5 text-[0.7rem] text-ink flex items-center gap-0.5">
                    <MdFavorite size={12} className="text-rose-500" /> {c.likeCount}
                  </span>
                )}
              </div>
              <div className="flex gap-3 text-xs text-muted mt-1 ml-3 items-center">
                <span>{timeAgo(c.createdAt)}</span>
                <button
                  onClick={() => like(c)}
                  className={`font-semibold hover:underline ${c.likedByMe ? "text-rose-500" : ""}`}
                >
                  {c.likedByMe ? "Liked" : "Like"}
                </button>
                {c.canDelete && (
                  <button onClick={() => remove(c)} className="hover:text-rose-600 font-semibold">
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          maxLength={1000}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-[0.9rem] outline-none focus:border-brand-500"
        />
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          className="w-10 h-10 rounded-full bg-gradient-brand text-white flex items-center justify-center disabled:opacity-40"
          aria-label="Send comment"
        >
          <MdSend size={18} />
        </button>
      </div>
    </div>
  );
}
