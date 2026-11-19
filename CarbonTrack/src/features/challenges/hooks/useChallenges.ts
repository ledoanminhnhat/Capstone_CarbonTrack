"use client";

import { useMemo, useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/error";
import type { ChallengeView } from "../types";
import { getChallenges, joinChallenge } from "../services/challenge.service";

/** Challenge của user: danh sách, chia nhóm, tham gia. */
export function useChallenges() {
  const toast = useToast();
  const { data, loading, reload, setData } = useAsync<ChallengeView[]>(getChallenges, [], []);
  const [joiningId, setJoiningId] = useState("");
  const challenges = data ?? [];

  const groups = useMemo(() => {
    const completed = challenges.filter((c) => c.joined && c.status === "COMPLETED");
    return {
      inProgress: challenges.filter((c) => c.joined && c.status !== "COMPLETED"),
      completed,
      available: challenges.filter((c) => !c.joined),
      pointsEarned: completed.reduce((s, c) => s + c.points, 0),
    };
  }, [challenges]);

  const join = async (c: ChallengeView) => {
    setJoiningId(c.id);
    try {
      await joinChallenge(c.id);
      await reload();
      toast.success(`Joined "${c.title}"`);
    } catch (e) {
      toast.error(errorMessage(e, "Failed to join challenge"));
    } finally {
      setJoiningId("");
    }
  };

  return { challenges, setChallenges: setData, loading, reload, ...groups, join, joiningId };
}
