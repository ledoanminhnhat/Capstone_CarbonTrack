"use client";

import { MdTrackChanges } from "react-icons/md";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import FormField from "@/components/ui/FormField";
import { MAX_YEARLY_GOAL_KG, MIN_YEARLY_GOAL_KG } from "@/constants/app";
import { round1 } from "@/utils/emission";
import type { UserProfile } from "@/types";
import { useTrackingSettings } from "../hooks/useTrackingSettings";
import SettingsSection from "./SettingsSection";

/** Mục tiêu phát thải năm; Dashboard dùng (năm / 12) làm mục tiêu tháng. */
export default function TrackingSection({
  profile,
  onUpdated,
}: {
  profile?: UserProfile;
  onUpdated: (p: UserProfile) => void;
}) {
  const t = useTrackingSettings(profile, onUpdated);

  return (
    <SettingsSection icon={<MdTrackChanges size={22} />} iconCls="text-amber-500 bg-amber-50" title="Tracking">
      <FormField label="Yearly emission goal">
        <div className="relative">
          <Input
            type="number"
            min={MIN_YEARLY_GOAL_KG}
            max={MAX_YEARLY_GOAL_KG}
            step={50}
            value={t.yearly}
            onChange={(e) => t.setYearly(e.target.value)}
            className="pr-24"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
            kg CO₂e
          </span>
        </div>
      </FormField>

      <div className="bg-amber-50 rounded-xl p-4 text-sm flex flex-col gap-1">
        <div className="flex justify-between">
          <span className="text-muted">Monthly goal (÷ 12)</span>
          <span className="text-ink font-bold">{round1(t.monthlyPreview).toLocaleString()} kg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Yearly goal</span>
          <span className="text-ink font-semibold">{(Number(t.yearly) / 1000 || 0).toFixed(2)} tons</span>
        </div>
        <p className="m-0 mt-1 text-muted text-xs">Used for &quot;Remaining goal&quot; and the goal line on your Dashboard.</p>
      </div>

      <Alert>{t.error}</Alert>
      <Button variant="gradient" size="full" className="mt-auto" onClick={t.save} disabled={t.saving || !t.dirty}>
        {t.saving ? "Saving..." : "Save goal"}
      </Button>
    </SettingsSection>
  );
}
