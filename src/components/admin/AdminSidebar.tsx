"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Newspaper,
  Image as ImageIcon,
  Menu,
  Settings,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/admin/auth-actions";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/menu", label: "Navigation", icon: Menu },
  { href: "/admin/pages", label: "Page sections", icon: Layers },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ email }: { email?: string | null }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex shrink-0 flex-col bg-[#1d1d1f] text-white transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      <div className={`flex items-center gap-3 border-b border-white/10 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
        {!collapsed && (
          <Image src="/brand/redi-logo.png" alt="REDI" width={80} height={38} className="h-8 w-auto brightness-0 invert" />
        )}
        {collapsed && <span className="text-lg font-bold text-[#d4a017]">R</span>}
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-4">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-white/12 text-white"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        {!collapsed && email && (
          <p className="mb-2 truncate px-2 text-[11px] text-white/40">{email}</p>
        )}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/50 transition hover:bg-white/8 hover:text-white ${collapsed ? "justify-center" : ""}`}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {!collapsed && "View site"}
        </a>
        <form action={signOut}>
          <button
            type="submit"
            className={`mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/50 transition hover:bg-red-500/20 hover:text-red-300 ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="h-3.5 w-3.5" />
            {!collapsed && "Sign out"}
          </button>
        </form>
      </div>

      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-black/10 bg-white text-[#1d1d1f] shadow-md transition hover:scale-105"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </aside>
  );
}
