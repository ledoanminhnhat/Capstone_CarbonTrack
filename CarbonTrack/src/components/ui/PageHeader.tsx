import React from "react";

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** nút / bộ lọc bên phải */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Tiêu đề trang:
 * - Trên mobile (< md): ẩn title & subtitle để tối đa không gian lướt tính năng như native app.
 *   Nếu có actions (như Export CSV), actions vẫn hiển thị gọn gàng.
 * - Trên desktop (md trở lên): hiển thị đầy đủ title, subtitle và actions.
 */
export default function PageHeader({ title, subtitle, actions, className = "" }: PageHeaderProps) {
  // Nếu không có actions thì trên mobile ẩn toàn bộ header
  const containerCls = actions
    ? `flex flex-wrap justify-between items-center md:items-start gap-4 mb-4 md:mb-8 ${className}`
    : `hidden md:flex flex-wrap justify-between items-start gap-4 mb-8 ${className}`;

  return (
    <header className={containerCls}>
      <div className="hidden md:block">
        <h2 className="text-[1.75rem] font-extrabold text-ink m-0 mb-1">{title}</h2>
        {subtitle && <p className="text-muted m-0 text-[0.9rem]">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-end">{actions}</div>}
    </header>
  );
}
