import {
  FaChartPie,
  FaClockRotateLeft,
  FaGear,
  FaRegLightbulb,
  FaTrophy,
  FaUserShield,
  FaUsers,
} from "react-icons/fa6";

export interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

/** Danh sách trang dùng chung cho Sidebar (desktop) và thanh dưới đáy (mobile). */
export const NAV = {
  home: { name: "Dashboard", href: "/home", icon: <FaChartPie size={18} /> },
  history: { name: "History", href: "/history", icon: <FaClockRotateLeft size={18} /> },
  challenges: { name: "Challenges", href: "/challenges", icon: <FaTrophy size={18} /> },
  community: { name: "Community", href: "/community", icon: <FaUsers size={18} /> },
  recommendations: { name: "Recommendations", href: "/recommendations", icon: <FaRegLightbulb size={18} /> },
  settings: { name: "Settings", href: "/settings", icon: <FaGear size={18} /> },
  admin: { name: "Admin", href: "/admin", icon: <FaUserShield size={18} /> },
} satisfies Record<string, NavLink>;

/** Thứ tự trên Sidebar. */
export const sidebarLinks = (isAdmin: boolean): NavLink[] => [
  NAV.home,
  NAV.history,
  NAV.challenges,
  NAV.community,
  NAV.recommendations,
  NAV.settings,
  ...(isAdmin ? [NAV.admin] : []),
];

/** Các trang nằm trong mục "More" của thanh dưới đáy (mobile). */
export const moreLinks = (isAdmin: boolean): NavLink[] => [
  NAV.challenges,
  NAV.recommendations,
  NAV.settings,
  ...(isAdmin ? [NAV.admin] : []),
];

/** Trang hiện tại có đang ở link này (hoặc trang con) không. */
export const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);
