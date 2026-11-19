"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaArrowRightFromBracket,
  FaChartPie,
  FaClockRotateLeft,
  FaGear,
  FaRegLightbulb,
  FaTrophy,
  FaUserShield,
  FaUsers,
} from "react-icons/fa6";
import Avatar from "@/components/ui/Avatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { logout } from "@/features/auth/services/auth.service";

const NAV_LINKS = [
  { name: "Dashboard", href: "/home", icon: <FaChartPie size={18} /> },
  { name: "History", href: "/history", icon: <FaClockRotateLeft size={18} /> },
  { name: "Challenges", href: "/challenges", icon: <FaTrophy size={18} /> },
  { name: "Community", href: "/community", icon: <FaUsers size={18} /> },
  { name: "Recommendations", href: "/recommendations", icon: <FaRegLightbulb size={18} /> },
  { name: "Settings", href: "/settings", icon: <FaGear size={18} /> },
];
const ADMIN_LINK = { name: "Admin", href: "/admin", icon: <FaUserShield size={18} /> };

/** Nhãn nổi bên phải khi sidebar đang thu gọn (rê chuột vào icon). */
function Tip({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 text-white text-xs font-semibold px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-card">
      {children}
    </span>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useCurrentUser();
  const [collapsed, setCollapsed] = useLocalStorageState("ct_sidebar_collapsed", false);
  const links = user?.role === "ADMIN" ? [...NAV_LINKS, ADMIN_LINK] : NAV_LINKS;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside
      className={`${
        collapsed ? "w-[76px] px-3" : "w-[260px] px-6"
      } bg-surface/80 backdrop-blur-sm flex flex-col py-8 shadow-soft sticky top-0 h-screen box-border shrink-0 transition-[width,padding] duration-200`}
    >
      {/* Logo + nút thu gọn */}
      <div className={`flex items-center mb-10 ${collapsed ? "flex-col gap-4" : "gap-3"}`}>
        <Image src="/assets/logo.png" alt="CarbonTrack" width={32} height={32} />
        {!collapsed && <h1 className="text-xl font-extrabold text-gradient-brand m-0 flex-1 truncate">CarbonTrack</h1>}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:bg-soft hover:text-ink transition-colors"
        >
          {collapsed ? <FaAnglesRight size={13} /> : <FaAnglesLeft size={13} />}
        </button>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              aria-label={link.name}
              className={`group relative flex items-center rounded-xl no-underline font-semibold transition-all duration-200 ${
                collapsed ? "justify-center h-11" : "gap-4 px-4 py-3"
              } ${active ? "text-white bg-gradient-brand shadow-glow-brand" : "text-muted hover:text-brand-700 hover:bg-brand-50"}`}
            >
              {link.icon}
              {!collapsed && <span className="truncate">{link.name}</span>}
              <Tip show={collapsed}>{link.name}</Tip>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-line">
        <div className={`flex items-center mb-4 ${collapsed ? "justify-center" : "gap-3"}`}>
          <Link href="/settings" title={collapsed ? user?.name : "Change avatar"} className="group relative">
            <Avatar id={user?.id} name={user?.name ?? "User"} avatarUrl={user?.avatarUrl} size={collapsed ? "sm" : "md"} />
          </Link>
          {!collapsed && <span className="font-semibold text-ink truncate">{user?.name ?? "User"}</span>}
        </div>
        <button
          onClick={handleLogout}
          aria-label="Logout"
          className={`group relative w-full flex items-center justify-center gap-2 border border-line-strong bg-surface rounded-xl font-semibold text-muted cursor-pointer transition-all duration-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 ${
            collapsed ? "h-11" : "p-3"
          }`}
        >
          <FaArrowRightFromBracket size={15} />
          {!collapsed && "Logout"}
          <Tip show={collapsed}>Logout</Tip>
        </button>
      </div>
    </aside>
  );
}
