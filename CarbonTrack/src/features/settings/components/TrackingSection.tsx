"use client";

import { FaBullseye, FaCalendarDays, FaCircleInfo } from "react-icons/fa6";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import FormField from "@/components/ui/FormField";
import { DEFAULT_YEARLY_GOAL_KG, MAX_YEARLY_GOAL_KG, MIN_YEARLY_GOAL_KG } from "@/constants/app";
import { round1 } from "@/utils/emission";
import type { UserProfile } from "@/types";
import { useTrackingSettings } from "../hooks/useTrackingSettings";
import SettingsSection from "./SettingsSection";
import SettingsAside, { AsideRow, SettingsLayout } from "./SettingsAside";

const PRESETS = [1200, 1800, 2400, 3600];

/** Tab Tracking: đặt mục tiêu phát thải năm + bảng quy đổi tháng / ngày. */
export default function TrackingSection({
  profile,
  onUpdated,
}: {
  profile?: UserProfile;
  onUpdated: (p: UserProfile) => void;
}) {
  const t = useTrackingSettings(profile, onUpdated);
  const yearly = Number(t.yearly) || 0;

  return (
    <SettingsLayout
      main={
        <SettingsSection icon={<FaBullseye size={16} />} iconCls="text-amber-500 bg-amber-50" title="Yearly emission goal">
          <FormField label="Goal for one year">
            <div className="relative">
              <Input
                type="number"
                min={MIN_YEARLY_GOAL_KG}
                max={MAX_YEARLY_GOAL_KG}
                step={50}
                value={t.yearly}
                onChange={(e) => t.setYearly(e.target.value)}
                className="pr-24 text-lg font-semibold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">kg CO₂e</span>
            </div>
          </FormField>

          <div>
            <p className="m-0 mb-2 text-muted text-[0.8rem] font-semibold">Quick presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((v) => (
                <button
                  key={v}
                  onClick={() => t.setYearly(String(v))}
                  className={`px-3 py-1.5 rounded-lg border text-[0.85rem] font-semibold transition-colors ${
                    yearly === v
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-line-strong text-muted hover:text-ink hover:border-brand-300"
                  }`}
                >
                  {v.toLocaleString()} kg
                  {v === DEFAULT_YEARLY_GOAL_KG && <span className="ml-1 font-normal">(default)</span>}
                </button>
              ))}
            </div>
          </div>

          <Alert>{t.error}</Alert>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => profile && t.setYearly(String(profile.yearlyGoalKg))}
              disabled={!t.dirty || t.saving}
            >
              Reset
            </Button>
            <Button variant="gradient" size="sm" className="px-6" onClick={t.save} disabled={t.saving || !t.dirty}>
              {t.saving ? "Saving..." : "Save goal"}
            </Button>
          </div>
        </SettingsSection>
      }
      aside={
        <>
          <SettingsAside title="Your goal at a glance" icon={<FaCalendarDays size={14} />}>
            <AsideRow label="Per year">{yearly.toLocaleString()} kg</AsideRow>
            <AsideRow label="Per month (÷ 12)">{round1(t.monthlyPreview).toLocaleString()} kg</AsideRow>
            <AsideRow label="Per day (÷ 365)">{round1(yearly / 365).toLocaleString()} kg</AsideRow>
            <AsideRow label="In tons">{(yearly / 1000).toFixed(2)} t</AsideRow>
          </SettingsAside>
          <SettingsAside title="How it's used" icon={<FaCircleInfo size={14} />}>
            <ul className="m-0 pl-4 text-muted text-[0.85rem] leading-relaxed flex flex-col gap-1.5">
              <li>
                <b className="text-ink">Remaining goal</b> on the Dashboard uses the monthly goal.
              </li>
              <li>The dashed line on the Emissions Trend chart is the daily goal.</li>
              <li>The card turns red when you go over this month&apos;s goal.</li>
            </ul>
          </SettingsAside>
        </>
      }
    />
  );
}
