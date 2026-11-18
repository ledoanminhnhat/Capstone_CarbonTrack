import React from "react";

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** nút / bộ lọc bên phải */
  actions?: React.ReactNode;
}

/** Tiêu đề trang thống nhất với Dashboard. */
export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap justify-between items-start gap-4 mb-8">
      <div>
        <h2 className="text-[1.75rem] font-extrabold text-ink m-0 mb-1">{title}</h2>
        {subtitle && <p className="text-muted m-0 text-[0.9rem]">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3 items-center">{actions}</div>}
    </header>
  );
}
