"use client";

import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState, { Loading } from "@/components/ui/EmptyState";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Author } from "@/features/community/types";
import { useFeed } from "@/features/community/hooks/useFeed";
import { useMutedUsers } from "@/features/community/hooks/useMutedUsers";
import { useLeaderboard } from "@/features/community/hooks/useLeaderboard";
import CreatePostPrompt from "@/features/community/components/CreatePostPrompt";
import PostCard from "@/features/community/components/PostCard";
import { GuidelinesCard, HiddenUsersCard, LeaderboardCard } from "@/features/community/components/CommunitySidebar";
import { FaEarthAsia } from "react-icons/fa6";

export default function CommunityPage() {
  const me = useCurrentUser();
  const feed = useFeed();
  const { muted, mute, unmute } = useMutedUsers();
  const leaders = useLeaderboard();

  const handleHide = async (author: Author) => {
    if (await mute(author)) feed.removeByAuthor(author.id);
  };
  const handleUnhide = async (author: Author) => {
    if (await unmute(author)) feed.reload(); // bài của họ hiện lại
  };

  return (
    <div>
      <PageHeader
        title="Green Community"
        subtitle="Share your eco wins, tips and photos with other CarbonTrack members."
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8 items-start">
        {/* Feed hẹp ở giữa như Instagram */}
        <div className="flex flex-col gap-6 min-w-0 w-full max-w-[680px] mx-auto">
          {me && <CreatePostPrompt me={me} onPosted={feed.addPost} />}

          <Alert>{feed.error}</Alert>

          {feed.loading ? (
            <Loading text="Loading feed..." />
          ) : feed.posts.length === 0 ? (
            <EmptyState icon={<FaEarthAsia size={28} className="text-brand-600" />}>No posts yet. Be the first to share something!</EmptyState>
          ) : (
            feed.posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                meId={me?.id ?? ""}
                highlighted={p.id === feed.highlightId}
                onLike={() => feed.toggleLike(p)}
                onShare={() => feed.share(p)}
                onDelete={() => feed.remove(p)}
                onHide={() => handleHide(p.author)}
                onCommentCountChange={(d) => feed.adjustCommentCount(p.id, d)}
              />
            ))
          )}

          {feed.hasMore && (
            <Button variant="outline" onClick={feed.loadMore} disabled={feed.loadingMore} className="self-center">
              {feed.loadingMore ? "Loading..." : "Load more"}
            </Button>
          )}
        </div>

        <aside className="flex flex-col gap-6 xl:sticky xl:top-0">
          <LeaderboardCard leaders={leaders} meId={me?.id} />
          <GuidelinesCard />
          <HiddenUsersCard muted={muted} onUnhide={handleUnhide} />
        </aside>
      </div>
    </div>
  );
}
