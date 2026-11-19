"use client";

import { useAsync } from "@/hooks/useAsync";
import { useInterval } from "@/hooks/useInterval";
import type { LeaderboardEntry } from "../types";
import { getLeaderboard } from "../services/community.service";

export function useLeaderboard() {
  const { data, reload } = useAsync<LeaderboardEntry[]>(getLeaderboard, [], []);
  useInterval(() => reload({ silent: true }), 60_000); // cập nhật chấm online
  return data ?? [];
}
