"use client";

import PageHeader from "@/components/ui/PageHeader";
import { useProfileSettings } from "@/features/settings/hooks/useProfileSettings";
import ProfileHeader from "@/features/settings/components/ProfileHeader";
import PersonalInfoSection from "@/features/settings/components/PersonalInfoSection";
import ChangePasswordSection from "@/features/settings/components/ChangePasswordSection";
import TrackingSection from "@/features/settings/components/TrackingSection";
import { ReminderSection } from "@/features/settings/components/ComingSoonSections";

export default function SettingsPage() {
  const p = useProfileSettings();

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile and account." />

      <ProfileHeader profile={p.profile} onUpdated={p.setProfile} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonalInfoSection
          name={p.name}
          email={p.profile?.email ?? ""}
          onNameChange={p.setName}
          error={p.error}
          saving={p.saving}
          onSave={p.saveName}
        />
        <ChangePasswordSection />
        <TrackingSection profile={p.profile} onUpdated={p.setProfile} />
        <ReminderSection />
      </div>
    </div>
  );
}
