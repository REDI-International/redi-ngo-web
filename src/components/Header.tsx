"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { ResolvedNavItem } from "@/lib/navigation";

export function Header({ items }: { items: ResolvedNavItem[] }) {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-dark bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="REDI — Roma Entrepreneurship Development Initiative">
          <Image
            src="/brand/redi-logo.png"
            alt="REDI — Roma Entrepreneurship Development Initiative"
            width={400}
            height={189}
            priority
            className="h-10 w-auto lg:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith(item.href) ? "text-primary" : "text-text-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={pathname}
            locale={locale === "en" ? "ro" : "en"}
            className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white"
          >
            {locale === "en" ? "RO" : "EN"}
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden rounded-lg border border-surface-dark px-3 py-2 text-sm"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {open && (
        <nav className="border-t border-surface-dark px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-text"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={pathname}
              locale={locale === "en" ? "ro" : "en"}
              className="text-sm font-semibold text-primary"
              onClick={() => setOpen(false)}
            >
              {locale === "en" ? "Română" : "English"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
