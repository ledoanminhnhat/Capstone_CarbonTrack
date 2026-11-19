"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FaArrowRightFromBracket,
  FaChevronRight,
  FaEllipsis,
  FaPlus,
  FaTrophy,
  FaXmark,
} from "react-icons/fa6";
import Avatar from "@/components/ui/Avatar";
import PresenceAvatar from "@/components/ui/PresenceAvatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/features/auth/services/auth.service";
import { useLeaderboard } from "@/features/community/hooks/useLeaderboard";
import LogActivityModal from "@/features/home/components/LogActivityModal";
import { NAV, isActive, moreLinks } from "./navLinks";

const RANK_COLOR = ["text-amber-500", "text-slate-400", "text-orange-400"];

function Tab({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex-1 flex flex-col items-center justify-center gap-1 text-[0.68rem] font-semibold no-underline transition-colors ${
        active ? "text-brand-600 dark:text-brand-400" : "text-muted hover:text-ink"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

/**
 * Thanh điều hướng đáy kết hợp Sidebar Drawer trượt từ phải sang:
 * - Dưới đáy: Home · History · [＋ Log activity] · Community · More
 * - Bấm "More": Mở Sidebar trượt từ phải sang, có các trang phụ + Mini Leaderboard
 */
export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const leaders = useLeaderboard();
  const [logOpen, setLogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const more = moreLinks(user?.role === "ADMIN");
  const moreActive = more.some((l) => isActive(pathname, l.href));

  // Khóa cuộn trang khi drawer mở
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const go = (href: string) => {
    setDrawerOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* 1. THANH ĐIỀU HƯỚNG DƯỚI ĐÁY (< md) */}
      <nav
        aria-label="Main Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-surface/95 backdrop-blur-md border-t border-line flex items-stretch px-2 pb-[env(safe-area-inset-bottom)]"
      >
        <Tab href={NAV.home.href} label="Home" icon={NAV.home.icon} active={isActive(pathname, NAV.home.href)} />
        <Tab href={NAV.history.href} label="History" icon={NAV.history.icon} active={isActive(pathname, NAV.history.href)} />

        {/* Nút ＋ ở giữa: log activity nhanh từ bất kỳ đâu */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => setLogOpen(true)}
            aria-label="Log new activity"
            className="-mt-5 w-14 h-14 rounded-full bg-gradient-brand text-white shadow-glow-brand flex items-center justify-center ring-4 ring-surface active:scale-95 transition-transform"
          >
            <FaPlus size={20} />
          </button>
        </div>

        <Tab
          href={NAV.community.href}
          label="Community"
          icon={NAV.community.icon}
          active={isActive(pathname, NAV.community.href)}
        />
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-[0.68rem] font-semibold transition-colors ${
            moreActive ? "text-brand-600 dark:text-brand-400" : "text-muted hover:text-ink"
          }`}
        >
          <FaEllipsis size={18} />
          More
        </button>
      </nav>

      {/* Modal Log Activity */}
      <LogActivityModal isOpen={logOpen} onClose={() => setLogOpen(false)} />

      {/* 2. SIDEBAR DRAWER TRƯỢT TỪ PHẢI SANG CHO MOBILE */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end"
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Menu & Leaderboard"
            className="w-[85vw] max-w-[340px] h-full bg-surface shadow-2xl flex flex-col overflow-y-auto animate-[slide-left_0.25s_ease-out] border-l border-line pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Drawer: User Info + Nút đóng */}
            <div className="p-5 border-b border-line flex items-center justify-between bg-subtle/50">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar id={user?.id} name={user?.name} avatarUrl={user?.avatarUrl} size="md" />
                <div className="min-w-0">
                  <div className="text-ink font-bold truncate text-[0.95rem]">{user?.name}</div>
                  <div className="text-muted text-xs truncate">{user?.email}</div>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-soft"
                aria-label="Close menu"
              >
                <FaXmark size={18} />
              </button>
            </div>

            {/* Mục 1: Menu các trang phụ */}
            <div className="p-4 flex flex-col gap-1">
              <span className="text-[0.75rem] font-bold text-muted uppercase tracking-wider px-3 mb-1">
                Navigation
              </span>
              {more.map((l) => (
                <button
                  key={l.href}
                  onClick={() => go(l.href)}
                  className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-left font-semibold text-sm transition-colors ${
                    isActive(pathname, l.href)
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-50/10 dark:text-brand-400"
                      : "text-ink hover:bg-subtle"
                  }`}
                >
                  <span className="w-5 flex justify-center text-muted">{l.icon}</span>
                  <span className="flex-1">{l.name}</span>
                  <FaChevronRight size={11} className="text-muted/60" />
                </button>
              ))}
            </div>

            {/* Mục 2: Leaderboard nằm ngay trong Sidebar Drawer */}
            <div className="p-4 mx-4 rounded-2xl bg-subtle/70 border border-line flex flex-col gap-3 my-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink text-sm flex items-center gap-2">
                  <FaTrophy className="text-amber-500" size={16} /> Leaderboard
                </span>
                <Link
                  href="/community"
                  onClick={() => setDrawerOpen(false)}
                  className="text-brand-600 text-xs font-semibold hover:underline"
                >
                  View Feed →
                </Link>
              </div>

              {leaders.length === 0 ? (
                <p className="text-muted text-xs m-0 py-2">No points yet. Complete challenges to rank!</p>
              ) : (
                <ol className="m-0 p-0 list-none flex flex-col gap-2.5">
                  {leaders.slice(0, 5).map((l, i) => (
                    <li key={l.id} className="flex items-center gap-2.5 text-xs">
                      <span className={`w-4 text-center font-extrabold ${RANK_COLOR[i] ?? "text-muted"}`}>
                        {i + 1}
                      </span>
                      <PresenceAvatar {...l} size="xs" />
                      <span className="flex-1 text-ink font-semibold truncate">
                        {l.name}
                        {l.id === user?.id && <span className="text-brand-600 font-bold"> (you)</span>}
                      </span>
                      <span className="text-brand-600 font-bold">{l.points.toLocaleString()} pts</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Mục 3: Logout ở cuối drawer */}
            <div className="mt-auto p-4 pt-2">
              <button
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-line-strong text-rose-600 font-semibold text-sm hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              >
                <FaArrowRightFromBracket size={14} /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
