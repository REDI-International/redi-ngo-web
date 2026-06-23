"use client";

import { Suspense } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { ToastProvider } from "./ToastProvider";
import type { AdminRole } from "@/lib/admin/roles";

export function AdminShell({
  email,
  role,
  children,
}: {
  email?: string | null;
  role?: AdminRole;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root flex min-h-screen">
      <AdminSidebar email={email} role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="admin-glass sticky top-0 z-30 border-b border-black/[0.06] px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-[#86868b]">Content Management</p>
            <p className="hidden text-xs text-[#86868b] sm:block">
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
        </header>
        <main className="flex-1 px-6 py-8 lg:px-10">
          <Suspense fallback={null}>
            <ToastProvider>{children}</ToastProvider>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
