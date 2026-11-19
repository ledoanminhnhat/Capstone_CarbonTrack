"use client";

import { FaArrowLeft } from "react-icons/fa6";
import PageHeader from "@/components/ui/PageHeader";
import { useProfileSettings } from "@/features/settings/hooks/useProfileSettings";
import { useSettingsTab } from "@/features/settings/hooks/useSettingsTab";
import SettingsNav, { SETTINGS_ITEMS } from "@/features/settings/components/SettingsNav";
import ProfileHeader from "@/features/settings/components/ProfileHeader";
import PersonalInfoSection from "@/features/settings/components/PersonalInfoSection";
import ChangePasswordSection from "@/features/settings/components/ChangePasswordSection";
import TrackingSection from "@/features/settings/components/TrackingSection";
import AppearanceSection from "@/features/settings/components/AppearanceSection";
import { ReminderSection } from "@/features/settings/components/ComingSoonSections";

/**
 * Settings:
 * - Desktop (md+): danh sách mục bên trái, nội dung mục đang chọn bên phải (mặc định Profile).
 * - Mobile: màn hình danh sách mục → bấm vào để mở mục, có nút Back.
 */
export default function SettingsPage() {
  const p = useProfileSettings();
  const { tab, setTab } = useSettingsTab();
  const active = tab ?? "profile"; // desktop luôn hiện 1 mục
  const current = SETTINGS_ITEMS.find((it) => it.id === active);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile, preferences and account settings." />

      {/* Mobile: màn hình danh sách (chưa chọn mục) */}
      {!tab && <SettingsNav active={null} onSelect={setTab} className="md:hidden" />}

      <div className={`${tab ? "" : "hidden"} md:grid md:grid-cols-[35%_minmax(0,1fr)] md:gap-8 md:items-start`}>
        <SettingsNav active={active} onSelect={setTab} className="hidden md:flex md:sticky md:top-6" />

        <div className="min-w-0">
          {/* Mobile: nút quay lại danh sách + tên mục */}
          <div className="md:hidden mb-5">
            <button
              onClick={() => setTab(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink px-3 py-2 -ml-3 rounded-xl hover:bg-subtle transition-colors"
            >
              <FaArrowLeft size={13} /> Back to Settings
            </button>
            {current && (
              <div className="mt-2">
                <h2 className="text-xl font-extrabold text-ink m-0">{current.label}</h2>
                <p className="text-muted text-sm m-0 mt-0.5">{current.hint}</p>
              </div>
            )}
          </div>

          {active === "profile" && (
            <>
              <ProfileHeader profile={p.profile} onUpdated={p.setProfile} />
              <PersonalInfoSection
                profile={p.profile}
                name={p.name}
                onNameChange={p.setName}
                error={p.error}
                saving={p.saving}
                onSave={p.saveName}
                onGoTo={setTab}
              />
            </>
          )}
          {active === "password" && (
            <ChangePasswordSection
              hasPassword={p.profile?.hasPassword ?? true}
              onPasswordSet={() => p.profile && p.setProfile({ ...p.profile, hasPassword: true })}
            />
          )}
          {active === "tracking" && <TrackingSection profile={p.profile} onUpdated={p.setProfile} />}
          {active === "appearance" && <AppearanceSection />}
          {active === "reminders" && <ReminderSection />}
        </div>
      </div>
    </div>
  );
}
