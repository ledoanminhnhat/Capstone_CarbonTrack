"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaChartPie, FaClockRotateLeft, FaGear, FaRegLightbulb, FaTrophy, FaUserShield, FaUsers } from "react-icons/fa6";
import Avatar from "@/components/ui/Avatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
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

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useCurrentUser();
  const links = user?.role === "ADMIN" ? [...NAV_LINKS, ADMIN_LINK] : NAV_LINKS;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside className="w-[260px] bg-white/80 backdrop-blur-sm flex flex-col py-8 px-6 shadow-soft sticky top-0 h-screen box-border">
      <div className="flex items-center gap-3 mb-12">
        <Image src="/assets/logo.png" alt="CarbonTrack" width={32} height={32} />
        <h1 className="text-xl font-extrabold text-gradient-brand m-0">CarbonTrack</h1>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl no-underline font-semibold transition-all duration-200 ${
                active ? "text-white bg-gradient-brand shadow-glow-brand" : "text-muted hover:text-brand-700 hover:bg-brand-50"
              }`}
            >
              {link.icon} {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/settings" title="Change avatar">
            <Avatar id={user?.id} name={user?.name ?? "User"} avatarUrl={user?.avatarUrl} size="md" />
          </Link>
          <span className="font-semibold text-ink truncate">{user?.name ?? "User"}</span>
        </div>
        <button
          className="w-full p-3 border border-gray-200 bg-white rounded-xl font-semibold text-muted cursor-pointer transition-all duration-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
