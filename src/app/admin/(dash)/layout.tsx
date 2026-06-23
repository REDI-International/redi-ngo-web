import { redirect } from "next/navigation";
import { isSupabaseConfigured, getAdminUser } from "@/lib/supabase/server";
import { getAdminSession, mustChangePassword } from "@/lib/admin/auth";
import { ConfigNotice } from "@/components/admin/ConfigNotice";
import { AdminShell } from "@/components/admin/AdminShell";
import { cleanEnvValue } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <ConfigNotice missing={["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]} />;
  }

  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  if (mustChangePassword(session.profile)) {
    redirect("/admin/change-password");
  }

  const dbConfigured = Boolean(cleanEnvValue(process.env.DATABASE_URL ?? ""));
  const serviceRoleConfigured = Boolean(cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""));

  return (
    <AdminShell email={user.email} role={session.role}>
      {!dbConfigured && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Database not connected.</strong> Add <code className="rounded bg-amber-100 px-1">DATABASE_URL</code>{" "}
          in Vercel and <code className="rounded bg-amber-100 px-1">.env.local</code> to enable content editing.
        </div>
      )}
      {!serviceRoleConfigured && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>User management limited.</strong> Add{" "}
          <code className="rounded bg-amber-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> to invite users and upload media.
        </div>
      )}
      <div className="mb-6 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
        <strong>Preview site on Vercel.</strong> This CMS edits{" "}
        <a
          href="https://redi-ngo-web.vercel.app"
          className="font-medium underline decoration-sky-400/60 underline-offset-2 hover:text-sky-900"
          target="_blank"
          rel="noreferrer"
        >
          redi-ngo-web.vercel.app
        </a>
        . <span className="text-sky-900/90">redi-ngo.eu remains WordPress until DNS is switched.</span>
      </div>
      {children}
    </AdminShell>
  );
}
