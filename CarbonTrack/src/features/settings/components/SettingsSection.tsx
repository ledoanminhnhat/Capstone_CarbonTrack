import React from "react";

/** Khung 1 nhóm cài đặt: icon + tiêu đề (+ badge) + nội dung. */
export default function SettingsSection({
  icon,
  iconCls,
  title,
  badge,
  children,
}: {
  icon: React.ReactNode;
  iconCls: string;
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-card flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconCls}`}>{icon}</span>
        <h3 className="m-0 font-bold text-[1.1rem] text-ink">{title}</h3>
        {badge && <span className="ml-auto">{badge}</span>}
      </div>
      {children}
    </div>
  );
}
