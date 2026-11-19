"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import EmptyState, { Loading } from "@/components/ui/EmptyState";
import type { ChallengeView } from "../types";
import { useChallenges } from "../hooks/useChallenges";
import ChallengeStats from "./ChallengeStats";
import JoinedChallengeCard from "./JoinedChallengeCard";
import AvailableChallengeCard from "./AvailableChallengeCard";
import ChallengeDetailModal from "./ChallengeDetailModal";
import { FaTrophy } from "react-icons/fa6";

/** Trang Challenges của user thường. */
export default function UserChallenges() {
  const { loading, inProgress, completed, available, pointsEarned, join, joiningId } = useChallenges();
  const [selected, setSelected] = useState<ChallengeView | null>(null);

  if (loading) return <Loading text="Loading challenges..." />;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <PageHeader
          title="Challenges"
          subtitle="Join a challenge, log matching activities, and earn points automatically."
        />
        <ChallengeStats
          inProgress={inProgress.length}
          completed={completed.length}
          available={available.length}
          pointsEarned={pointsEarned}
        />
      </div>

      <section>
        <SectionTitle count={inProgress.length}>In progress</SectionTitle>
        {inProgress.length === 0 ? (
          <EmptyState dashed>No challenge in progress yet. Pick one below to get started!</EmptyState>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {inProgress.map((c) => (
              <JoinedChallengeCard key={c.id} c={c} onClick={() => setSelected(c)} />
            ))}
          </div>
        )}
      </section>

      {completed.length > 0 && (
        <section>
          <SectionTitle count={completed.length}>
            <FaTrophy className="text-amber-500" size={16} /> Completed
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {completed.map((c) => (
              <JoinedChallengeCard key={c.id} c={c} onClick={() => setSelected(c)} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionTitle count={available.length}>More challenges</SectionTitle>
        {available.length === 0 ? (
          <EmptyState dashed>You&apos;ve joined every available challenge. Nice work!</EmptyState>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {available.map((c) => (
              <AvailableChallengeCard
                key={c.id}
                c={c}
                joining={joiningId === c.id}
                onJoin={() => join(c)}
                onClick={() => setSelected(c)}
              />
            ))}
          </div>
        )}
      </section>

      <ChallengeDetailModal
        c={selected}
        joining={!!selected && joiningId === selected.id}
        onJoin={async () => {
          if (!selected) return;
          await join(selected);
          setSelected(null);
        }}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
