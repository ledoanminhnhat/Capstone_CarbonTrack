import { FaBell, FaEnvelope, FaTrophy, FaBolt } from "react-icons/fa6";
import Badge from "@/components/ui/Badge";
import SettingsSection from "./SettingsSection";

const comingSoon = (
  <Badge tone="neutral" variant="outline" size="sm">
    Coming soon
  </Badge>
);

const REMINDERS: { label: string; hint: string; icon: React.ReactNode; on: boolean }[] = [
  { label: "Daily reminder", hint: "A nudge to log today's activities and check your tip", icon: <FaBell size={14} />, on: true },
  { label: "Challenge completed", hint: "Celebrate when you finish a challenge", icon: <FaTrophy size={14} />, on: false },
  { label: "New challenges", hint: "Hear about challenges as soon as they're added", icon: <FaBolt size={14} />, on: false },
  { label: "Weekly summary email", hint: "Your footprint and progress every Monday", icon: <FaEnvelope size={14} />, on: false },
];

/** Công tắc dạng toggle (chỉ hiển thị). */
function Switch({ on }: { on: boolean }) {
  return (
    <span className={`w-10 h-6 rounded-full p-0.5 flex transition-colors ${on ? "bg-brand-500 justify-end" : "bg-line-strong"}`}>
      <span className="w-5 h-5 rounded-full bg-white shadow" />
    </span>
  );
}

/** Reminder (giao diện, chưa nối backend). */
export function ReminderSection() {
  return (
    <SettingsSection icon={<FaBell size={16} />} iconCls="text-rose-500 bg-rose-50" title="Reminders" badge={comingSoon}>
      <div className="flex flex-col opacity-60 pointer-events-none" aria-disabled>
        {REMINDERS.map((r) => (
          <div key={r.label} className="flex items-center gap-4 py-3.5 border-b border-line last:border-b-0">
            <span className="w-9 h-9 rounded-xl bg-soft text-muted flex items-center justify-center shrink-0">{r.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-ink font-semibold text-[0.92rem]">{r.label}</div>
              <div className="text-muted text-[0.8rem]">{r.hint}</div>
            </div>
            <Switch on={r.on} />
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}
