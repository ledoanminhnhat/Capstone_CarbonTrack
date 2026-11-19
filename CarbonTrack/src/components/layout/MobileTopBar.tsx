"use client";

import Image from "next/image";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/**
 * Thanh trên cùng trên mobile:
 * Cao thoáng (h-16), padding rộng rãi, hỗ trợ notch/tai thỏ (safe-area-inset-top),
 * hiệu ứng kính mờ (backdrop-blur-md) và bóng nhẹ.
 */
export default function MobileTopBar() {
  const user = useCurrentUser();

  return (
    <header className="md:hidden sticky top-0 z-30 bg-surface/85 backdrop-blur-md border-b border-line shadow-soft pt-[env(safe-area-inset-top)] transition-colors">
      <div className="h-16 px-5 flex items-center justify-between">
        {/* Logo + Tên thương hiệu thoáng đãng */}
        <Link href="/home" className="flex items-center gap-3 no-underline group">
          <div className="w-9 h-9 rounded-xl bg-surface shadow-sm border border-line flex items-center justify-center p-1.5 transition-transform group-active:scale-95">
            <Image src="/assets/logo.png" alt="CarbonTrack" width={24} height={24} className="w-auto h-auto object-contain" />
          </div>
          <span className="text-xl font-extrabold text-gradient-brand tracking-tight">
            CarbonTrack
          </span>
        </Link>

        {/* Nút Avatar tròn chuẩn 100% */}
        <Link
          href="/settings"
          aria-label="Settings"
          className="w-9 h-9 rounded-full ring-2 ring-line-strong hover:ring-brand-500 transition-all active:scale-95 shadow-sm flex items-center justify-center shrink-0 overflow-hidden"
        >
          <Avatar id={user?.id} name={user?.name} avatarUrl={user?.avatarUrl} size="sm" />
        </Link>
      </div>
    </header>
  );
}
