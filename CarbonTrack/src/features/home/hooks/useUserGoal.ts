"use client";

import { useAsync } from "@/hooks/useAsync";
import { DEFAULT_YEARLY_GOAL_KG } from "@/constants/app";
import { monthlyGoalOf } from "@/utils/emission";
import { getProfile } from "@/services/user.service";

/** Điểm (thẻ Score) + mục tiêu phát thải năm / tháng của user. */
export function useUserGoal() {
  const { data } = useAsync(getProfile, []);
  const yearlyGoalKg = data?.yearlyGoalKg ?? DEFAULT_YEARLY_GOAL_KG;
  return {
    points: data?.points ?? 0,
    yearlyGoalKg,
    monthlyGoalKg: monthlyGoalOf(yearlyGoalKg),
  };
}
