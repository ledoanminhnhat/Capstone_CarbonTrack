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
  { id: "profile", label: "Profile", hint: "Photo, name, email", icon: <FaUser size={16} />, iconCls: "text-brand-600 bg-brand-50" },
  { id: "password", label: "Password", hint: "Change your password & security", icon: <FaLock size={16} />, iconCls: "text-sky-600 bg-sky-50" },
  { id: "tracking", label: "Tracking Goal", hint: "Yearly and monthly emission targets", icon: <FaBullseye size={16} />, iconCls: "text-amber-500 bg-amber-50" },
  { id: "appearance", label: "Appearance", hint: "Light, dark or system theme", icon: <FaCircleHalfStroke size={16} />, iconCls: "text-violet-600 bg-violet-50" },
  { id: "reminders", label: "Reminders", hint: "Activity alerts, weekly reports", icon: <FaBell size={16} />, iconCls: "text-rose-500 bg-rose-50", soon: true },
];

/**
 * Danh sách mục Settings (style thẻ kiểu mobile).
 * - Desktop: cột bên trái, mục đang mở được tô sáng.
 * - Mobile: màn hình danh sách, bấm vào để mở mục (active = null).
 */
export default function SettingsNav({
  active,
  onSelect,
  className = "",
}: {
  active: SettingsTab | null;
  onSelect: (t: SettingsTab) => void;
  className?: string;
}) {
  return (
    <nav
      aria-label="Settings sections"
      className={`bg-surface rounded-2xl shadow-card border border-line p-2 sm:p-3 flex flex-col gap-1.5 self-start ${className}`}
    >
      {SETTINGS_ITEMS.map((it) => {
        const on = it.id === active;
        return (
          <button
            key={it.id}
            onClick={() => onSelect(it.id)}
            aria-current={on ? "page" : undefined}
            className={`w-full flex items-center gap-4 p-3.5 rounded-xl text-left transition-all duration-150 group ${
              on ? "bg-brand-50" : "hover:bg-subtle"
            }`}
          >
            <span className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${it.iconCls}`}>
              {it.icon}
            </span>
            <span className="flex-1 min-w-0">
              <span
                className={`flex items-center gap-2 font-bold text-[0.95rem] transition-colors ${
                  on ? "text-brand-700" : "text-ink group-hover:text-brand-600"
                }`}
              >
                {it.label}
                {it.soon && (
                  <Badge tone="neutral" variant="outline" size="sm">
                    Soon
                  </Badge>
                )}
              </span>
              <span className="block text-muted text-[0.8rem] mt-0.5 truncate">{it.hint}</span>
            </span>
            <FaAngleRight
              size={14}
              className={`shrink-0 transition-all ${
                on ? "text-brand-600" : "text-muted/60 group-hover:text-brand-600 group-hover:translate-x-1"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
