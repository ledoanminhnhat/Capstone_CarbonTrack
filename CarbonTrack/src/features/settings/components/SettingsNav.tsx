"use client";

import { FaAngleRight, FaBell, FaBullseye, FaCircleHalfStroke, FaLock, FaUser } from "react-icons/fa6";
import Badge from "@/components/ui/Badge";
import type { SettingsTab } from "../hooks/useSettingsTab";

export const SETTINGS_ITEMS: {
  id: SettingsTab;
  label: string;
  hint: string;
  icon: React.ReactNode;
  iconCls: string;
  soon?: boolean;
}[] = [
  { id: "profile", label: "Profile", hint: "Photo, name, email", icon: <FaUser size={14} />, iconCls: "text-brand-600 bg-brand-50" },
  { id: "password", label: "Password", hint: "Change your password", icon: <FaLock size={14} />, iconCls: "text-sky-600 bg-sky-50" },
  { id: "tracking", label: "Tracking", hint: "Yearly emission goal", icon: <FaBullseye size={14} />, iconCls: "text-amber-500 bg-amber-50" },
  { id: "appearance", label: "Appearance", hint: "Light, dark or auto", icon: <FaCircleHalfStroke size={14} />, iconCls: "text-violet-600 bg-violet-50" },
  { id: "reminders", label: "Reminders", hint: "Notifications", icon: <FaBell size={14} />, iconCls: "text-rose-500 bg-rose-50", soon: true },
];

/** Danh sách mục bên trái trang Settings. */
export default function SettingsNav({ active, onSelect }: { active: SettingsTab; onSelect: (t: SettingsTab) => void }) {
  return (
    <nav aria-label="Settings sections" className="bg-surface rounded-2xl shadow-card p-3 flex flex-col gap-2 self-start">
      {SETTINGS_ITEMS.map((it) => {
        const on = it.id === active;
        return (
          <button
            key={it.id}
            onClick={() => onSelect(it.id)}
            aria-current={on ? "page" : undefined}
            className={`flex items-center gap-3 px-3 py-3.5 rounded-xl text-left transition-colors ${
              on ? "bg-brand-50" : "hover:bg-subtle"
            }`}
          >
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${it.iconCls}`}>{it.icon}</span>
            <span className="flex-1 min-w-0">
              <span className={`flex items-center gap-2 font-semibold text-[0.9rem] ${on ? "text-brand-700" : "text-ink"}`}>
                {it.label}
                {it.soon && (
                  <Badge tone="neutral" variant="outline" size="sm">
                    Soon
                  </Badge>
                )}
              </span>
              <span className="block text-muted text-[0.75rem] truncate">{it.hint}</span>
            </span>
            <FaAngleRight size={12} className={on ? "text-brand-600" : "text-muted/50"} />
          </button>
        );
      })}
    </nav>
  );
}
