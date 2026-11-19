"use client";

import PageHeader from "@/components/ui/PageHeader";
import { useProfileSettings } from "@/features/settings/hooks/useProfileSettings";
import { useSettingsTab } from "@/features/settings/hooks/useSettingsTab";
import SettingsNav from "@/features/settings/components/SettingsNav";
import ProfileHeader from "@/features/settings/components/ProfileHeader";
import PersonalInfoSection from "@/features/settings/components/PersonalInfoSection";
import ChangePasswordSection from "@/features/settings/components/ChangePasswordSection";
import TrackingSection from "@/features/settings/components/TrackingSection";
import AppearanceSection from "@/features/settings/components/AppearanceSection";
import { ReminderSection } from "@/features/settings/components/ComingSoonSections";

export default function SettingsPage() {
  const p = useProfileSettings();
  const { tab, setTab } = useSettingsTab();

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile and account." />

      {/* Danh sách mục bên trái, nội dung mục đang chọn bên phải */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 items-start">
        <SettingsNav active={tab} onSelect={setTab} />

        <div className="min-w-0">
          {tab === "profile" && (
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
          {tab === "password" && <ChangePasswordSection />}
          {tab === "tracking" && <TrackingSection profile={p.profile} onUpdated={p.setProfile} />}
          {tab === "appearance" && <AppearanceSection />}
          {tab === "reminders" && <ReminderSection />}
        </div>
      </div>
    </div>
  );
}
