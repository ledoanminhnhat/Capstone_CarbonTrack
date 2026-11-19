"use client";

import { FaAngleRight, FaArrowLeft, FaBell, FaBullseye, FaCircleHalfStroke, FaLock, FaUser } from "react-icons/fa6";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import { useProfileSettings } from "@/features/settings/hooks/useProfileSettings";
import { useSettingsTab, type SettingsTab } from "@/features/settings/hooks/useSettingsTab";
import ProfileHeader from "@/features/settings/components/ProfileHeader";
import PersonalInfoSection from "@/features/settings/components/PersonalInfoSection";
import ChangePasswordSection from "@/features/settings/components/ChangePasswordSection";
import TrackingSection from "@/features/settings/components/TrackingSection";
import AppearanceSection from "@/features/settings/components/AppearanceSection";
import { ReminderSection } from "@/features/settings/components/ComingSoonSections";

export const SETTINGS_ITEMS: {
  id: SettingsTab;
  label: string;
  hint: string;
  icon: React.ReactNode;
  iconCls: string;
  soon?: boolean;
}[] = [
  { id: "profile", label: "Profile", hint: "Photo, name, email", icon: <FaUser size={16} />, iconCls: "text-brand-600 bg-brand-50" },
  { id: "password", label: "Password", hint: "Change your password & security", icon: <FaLock size={16} />, iconCls: "text-sky-600 bg-sky-50" },
  { id: "tracking", label: "Tracking Goal", hint: "Yearly and monthly carbon emission targets", icon: <FaBullseye size={16} />, iconCls: "text-amber-500 bg-amber-50" },
  { id: "appearance", label: "Appearance", hint: "Customize light, dark or system theme", icon: <FaCircleHalfStroke size={16} />, iconCls: "text-violet-600 bg-violet-50" },
  { id: "reminders", label: "Reminders & Notifications", hint: "Activity alerts, weekly reports", icon: <FaBell size={16} />, iconCls: "text-rose-500 bg-rose-50", soon: true },
];

export default function SettingsPage() {
  const p = useProfileSettings();
  const { tab, setTab } = useSettingsTab();

  // MÀN HÌNH 1: Khi chưa chọn mục nào (tab === null) -> chỉ hiện danh sách các mục
  if (!tab) {
    return (
      <div className="max-w-[760px] mx-auto">
        <PageHeader title="Settings" subtitle="Manage your profile, preferences and account settings." />

        <div className="bg-surface rounded-2xl shadow-card border border-line p-2 sm:p-4 flex flex-col gap-2">
          {SETTINGS_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl text-left hover:bg-subtle transition-all duration-150 group"
            >
              <span className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${item.iconCls}`}>
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink text-[1rem] group-hover:text-brand-600 transition-colors">
                    {item.label}
                  </span>
                  {item.soon && (
                    <Badge tone="neutral" variant="outline" size="sm">
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <span className="block text-muted text-sm mt-0.5 truncate">{item.hint}</span>
              </div>
              <FaAngleRight size={14} className="text-muted/60 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // MÀN HÌNH 2: Khi đã click vào 1 mục -> hiển thị nút "Back to Settings" và nội dung mục đó
  const currentItem = SETTINGS_ITEMS.find((it) => it.id === tab);

  return (
    <div className="max-w-[1000px] mx-auto">
      {/* Nút Back to Settings */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setTab(null)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink px-3 py-2 rounded-xl hover:bg-subtle transition-colors"
        >
          <FaArrowLeft size={13} /> Back to Settings
        </button>
      </div>

      <PageHeader
        title={currentItem?.label ?? "Settings"}
        subtitle={currentItem?.hint}
      />

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
  );
}
