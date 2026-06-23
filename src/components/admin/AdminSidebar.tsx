"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/admin/auth-actions";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/tenders", label: "Tenders & Grants" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/media", label: "Media gallery" },
  { href: "/admin/menu", label: "Menu / Navigation" },
  { href: "/admin/settings", label: "Site settings" },
];

export function AdminSidebar({ email }: { email?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-surface-dark bg-white">
      <div className="px-5 py-5">
        <span className="font-heading text-lg font-bold text-primary">REDI Admin</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-primary text-white" : "text-text hover:bg-surface"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-surface-dark px-5 py-4">
        {email && <p className="mb-2 truncate text-xs text-text-muted">{email}</p>}
        <a href="/" target="_blank" rel="noreferrer" className="block text-xs text-text-muted hover:text-primary">
          View site ↗
        </a>
        <form action={signOut} className="mt-3">
          <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
