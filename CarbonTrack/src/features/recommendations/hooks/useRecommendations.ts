"use client";

import { useMemo, useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/components/ui/Toast";
import { monthKeyOf } from "@/utils/date";
import { errorMessage } from "@/utils/error";
import { percent, round1 } from "@/utils/emission";
import type { ChallengeView } from "@/features/challenges/types";
import { getChallenges } from "@/features/challenges/services/challenge.service";
import type { Recommendation, RecommendationResponse } from "../types";
import { applyRecommendation, getRecommendations } from "../services/recommendation.service";

export type Period = "month" | "all";
export type SortKey = "saving" | "difficulty";

const DIFF_ORDER = { EASY: 0, MEDIUM: 1, HARD: 2 };

/** Gợi ý + challenge đã tham gia; lọc theo kỳ, sắp xếp, biến gợi ý thành challenge. */
export function useRecommendations() {
  const toast = useToast();
  const [period, setPeriod] = useState<Period>("month");
  const [sortBy, setSortBy] = useState<SortKey>("saving");
  const [applyingId, setApplyingId] = useState("");

  const { data, loading, error, setData } = useAsync(
    async () => {
      const [rec, challenges] = await Promise.all([
        getRecommendations(period === "month" ? monthKeyOf() : undefined),
        getChallenges(),
      ]);
      return { rec, challenges };
    },
    [period]
  );
  const rec: RecommendationResponse | undefined = data?.rec;
  const challenges: ChallengeView[] = data?.challenges ?? [];

  const sorted = useMemo(() => {
    const list = [...(rec?.recommendations ?? [])];
    if (sortBy === "difficulty") {
      list.sort(
        (a, b) => DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty] || b.estimatedSavingKg - a.estimatedSavingKg
      );
    }
    return list; // backend đã sắp theo saving
  }, [rec, sortBy]);

  /** Challenge đang tham gia khớp với gợi ý (theo sub-category). */
  const challengeFor = (r: Recommendation) =>
    r.challengeMatch
      ? challenges.find((c) => c.joined && c.matchType === "SUBCATEGORY" && c.matchValue === r.challengeMatch)
      : undefined;

  const apply = async (r: Recommendation) => {
    setApplyingId(r.id);
    try {
      const res = await applyRecommendation(r.id);
      const fresh = await getChallenges();
      setData((d) => (d ? { ...d, challenges: fresh } : d));
      toast.success(`Challenge started: ${res.title}`);
    } catch (e) {
      toast.error(errorMessage(e, "Failed to start challenge"));
    } finally {
      setApplyingId("");
    }
  };

  const summary = rec && {
    top: rec.breakdown[0],
    savingPct: percent(rec.totalPotentialSaving, rec.totalCo2),
    after: round1(rec.totalCo2 - rec.totalPotentialSaving),
  };

  return {
    period,
    setPeriod,
    periodLabel: period === "month" ? "this month" : "all time",
    sortBy,
    setSortBy,
    rec,
    sorted,
    summary,
    loading,
    error,
    challengeFor,
    apply,
    applyingId,
  };
}
