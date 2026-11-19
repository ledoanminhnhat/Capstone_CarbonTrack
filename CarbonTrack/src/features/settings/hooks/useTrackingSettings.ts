"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { MAX_YEARLY_GOAL_KG, MIN_YEARLY_GOAL_KG } from "@/constants/app";
import { errorMessage } from "@/utils/error";
import { monthlyGoalOf } from "@/utils/emission";
import type { UserProfile } from "@/types";
import { updateTracking } from "@/services/user.service";

/** Mục tiêu phát thải năm: nhập, xem trước mục tiêu tháng, lưu. */
export function useTrackingSettings(profile: UserProfile | undefined, onUpdated: (p: UserProfile) => void) {
  const toast = useToast();
  const [yearly, setYearly] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setYearly(String(profile.yearlyGoalKg));
  }, [profile?.yearlyGoalKg]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = Number(yearly);
  const valid = yearly.trim() !== "" && Number.isFinite(value);
  const monthlyPreview = valid ? monthlyGoalOf(value) : 0;
  const dirty = !!profile && valid && value !== profile.yearlyGoalKg;

  const save = async () => {
    if (!valid || value < MIN_YEARLY_GOAL_KG || value > MAX_YEARLY_GOAL_KG) {
      setError(
        `Yearly goal must be between ${MIN_YEARLY_GOAL_KG.toLocaleString()} and ${MAX_YEARLY_GOAL_KG.toLocaleString()} kg`
      );
      return;
    }
    setError("");
    setSaving(true);
    try {
      onUpdated(await updateTracking(value));
      toast.success("Yearly goal updated");
    } catch (e) {
      setError(errorMessage(e, "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  return { yearly, setYearly, monthlyPreview, error, saving, dirty, save };
}
