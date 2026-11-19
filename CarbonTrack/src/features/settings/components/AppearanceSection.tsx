"use client";

import { FaCircleHalfStroke, FaDesktop, FaMoon, FaSun, FaCheck } from "react-icons/fa6";
import { useTheme, type ThemePref } from "@/providers/ThemeProvider";
import SettingsSection from "./SettingsSection";

const OPTIONS: { value: ThemePref; label: string; hint: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", hint: "Always use the light theme", icon: <FaSun size={14} /> },
  { value: "dark", label: "Dark", hint: "Easier on the eyes at night", icon: <FaMoon size={14} /> },
  { value: "system", label: "Auto", hint: "Follow your device setting", icon: <FaDesktop size={14} /> },
];

/** Khung app thu nhỏ với màu cố định của từng theme (để xem trước). */
function MiniApp({ dark }: { dark: boolean }) {
  const page = dark ? "#141517" : "#f0fdf4";
  const card = dark ? "#1c1e21" : "#ffffff";
  const line = dark ? "#2e3135" : "#e5e7eb";
  return (
    <div className="flex h-full" style={{ background: page }}>
      <div className="w-1/5 p-1.5 flex flex-col gap-1" style={{ background: card, borderRight: `1px solid ${line}` }}>
        <span className="h-1.5 rounded-full bg-gradient-brand" />
        <span className="h-1.5 rounded-full" style={{ background: line }} />
        <span className="h-1.5 rounded-full" style={{ background: line }} />
      </div>
      <div className="flex-1 p-2 flex flex-col gap-1.5">
        <div className="grid grid-cols-3 gap-1.5">
          <span className="h-5 rounded bg-gradient-brand" />
          <span className="h-5 rounded" style={{ background: card, border: `1px solid ${line}` }} />
          <span className="h-5 rounded bg-gradient-ocean" />
        </div>
        <span className="flex-1 rounded" style={{ background: card, border: `1px solid ${line}` }} />
      </div>
    </div>
  );
}

/** Tab Appearance: Light / Dark / Auto, có xem trước. Lưu trên máy này. */
export default function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <SettingsSection icon={<FaCircleHalfStroke size={16} />} iconCls="text-violet-600 bg-violet-50" title="Theme">
      <div role="radiogroup" aria-label="Theme" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {OPTIONS.map((o) => {
          const active = theme === o.value;
          return (
            <button
              key={o.value}
              role="radio"
              aria-checked={active}
              onClick={() => setTheme(o.value)}
              className={`relative rounded-2xl border-2 p-3 text-left transition-colors ${
                active ? "border-brand-500" : "border-line-strong hover:border-brand-300"
              }`}
            >
              <div className="h-32 rounded-xl overflow-hidden border border-line">
                {o.value === "system" ? (
                  <div className="relative h-full">
                    <MiniApp dark={false} />
                    <div className="absolute inset-0" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}>
                      <MiniApp dark />
                    </div>
                  </div>
                ) : (
                  <MiniApp dark={o.value === "dark"} />
                )}
              </div>
              <div className="flex items-center gap-2 mt-3 text-ink font-semibold">
                {o.icon}
                {o.label}
              </div>
              <div className="text-muted text-[0.8rem]">{o.hint}</div>
              {active && (
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center shadow">
                  <FaCheck size={11} />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-1 text-muted text-xs">
        <p className="m-0">Your choice is saved on this device.</p>
        <p className="m-0 text-muted/80">
          Note: Auto follows your operating system or browser app color scheme.
        </p>
      </div>
    </SettingsSection>
  );
}
