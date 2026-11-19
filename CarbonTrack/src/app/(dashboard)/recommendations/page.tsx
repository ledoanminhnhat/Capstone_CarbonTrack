"use client";

import PageHeader from "@/components/ui/PageHeader";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import SectionTitle from "@/components/ui/SectionTitle";
import EmptyState, { Loading } from "@/components/ui/EmptyState";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRecommendations, type Period, type SortKey } from "@/features/recommendations/hooks/useRecommendations";
import RecommendationStats from "@/features/recommendations/components/RecommendationStats";
import FootprintDrivers from "@/features/recommendations/components/FootprintDrivers";
import RecommendationCard from "@/features/recommendations/components/RecommendationCard";
import { FaSeedling } from "react-icons/fa6";

const PERIOD_OPTIONS = [
  { label: "This month", value: "month" },
  { label: "All time", value: "all" },
];
const SORT_OPTIONS = [
  { label: "Biggest saving", value: "saving" },
  { label: "Easiest first", value: "difficulty" },
];

export default function RecommendationsPage() {
  const user = useCurrentUser();
  const r = useRecommendations();

  return (
    <div>
      <PageHeader
        title="Recommendations"
        subtitle={`Personalized ways to cut your footprint, based on your activities ${r.periodLabel}.`}
        actions={
          <>
            <div className="w-[150px]">
              <Select value={r.period} onChange={(v) => r.setPeriod(v as Period)} options={PERIOD_OPTIONS} />
            </div>
            {/* Desktop: hiện ở header như cũ */}
            <div className="hidden md:block w-[190px]">
              <Select value={r.sortBy} onChange={(v) => r.setSortBy(v as SortKey)} options={SORT_OPTIONS} />
            </div>
          </>
        }
      />

      <Alert className="mb-6">{r.error}</Alert>

      {r.loading ? (
        <Loading text="Loading recommendations..." />
      ) : r.rec && r.summary && r.rec.totalCo2 === 0 ? (
        <EmptyState
          icon={<FaSeedling size={28} className="text-brand-600" />}
          action={
            r.period === "month" && (
              <Button variant="outline" size="sm" onClick={() => r.setPeriod("all")}>
                View all time
              </Button>
            )
          }
        >
          No activities {r.periodLabel}. Log some activities to get personalized recommendations.
        </EmptyState>
      ) : r.rec && r.summary ? (
        <>
          <RecommendationStats
            rec={r.rec}
            top={r.summary.top}
            savingPct={r.summary.savingPct}
            periodLabel={r.periodLabel}
          />
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
            <FootprintDrivers
              userName={user?.name}
              totalCo2={r.rec.totalCo2}
              breakdown={r.rec.breakdown}
              after={r.summary.after}
              savingPct={r.summary.savingPct}
            />
            <div className="flex flex-col gap-4">
              {/* Tiêu đề Your Action Plan + Filter sort đặt cạnh nhau trên mobile */}
              <div className="flex items-center justify-between gap-3 mb-1">
                <SectionTitle className="m-0">Your Action Plan</SectionTitle>
                <div className="md:hidden w-[160px]">
                  <Select value={r.sortBy} onChange={(v) => r.setSortBy(v as SortKey)} options={SORT_OPTIONS} />
                </div>
              </div>
              {r.sorted.map((rec, i) => (
                <RecommendationCard
                  key={rec.id}
                  rec={rec}
                  challenge={r.challengeFor(rec)}
                  isTop={r.sortBy === "saving" && i === 0}
                  applying={r.applyingId === rec.id}
                  onApply={() => r.apply(rec)}
                />
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
