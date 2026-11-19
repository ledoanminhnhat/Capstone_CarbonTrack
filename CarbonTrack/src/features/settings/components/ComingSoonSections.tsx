import { MdNotifications } from "react-icons/md";
import Badge from "@/components/ui/Badge";
import SettingsSection from "./SettingsSection";

const comingSoon = <Badge tone="neutral" variant="outline" size="sm">Coming soon</Badge>;

const REMINDERS: [string, boolean][] = [
  ["Daily reminder for challenges and tips", true],
  ["Notify me when a challenge is completed", false],
  ["Announce new challenges", false],
];

/** Reminder (chưa nối backend). */
export function ReminderSection() {
  return (
    <SettingsSection icon={<MdNotifications size={22} />} iconCls="text-rose-500 bg-rose-50" title="Reminders" badge={comingSoon}>
      <div className="flex flex-col gap-4 opacity-60 pointer-events-none">
        {REMINDERS.map(([label, checked]) => (
          <label key={label} className="flex items-center gap-3">
            <input type="checkbox" defaultChecked={checked} className="w-5 h-5 accent-brand-500" />
            <span className="text-ink text-[0.95rem]">{label}</span>
          </label>
        ))}
      </div>
    </SettingsSection>
  );
}
