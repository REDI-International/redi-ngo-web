import { redirect } from "next/navigation";
import { isSupabaseConfigured, getAdminUser } from "@/lib/supabase/server";
import { ConfigNotice } from "@/components/admin/ConfigNotice";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <ConfigNotice missing={["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]} />;
  }

  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const dbConfigured = Boolean(process.env.DATABASE_URL);

  return (
    <AdminShell email={user.email}>
      {!dbConfigured && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Database not connected.</strong> Add <code className="rounded bg-amber-100 px-1">DATABASE_URL</code> to
          enable content editing. Auth works; data changes require the Postgres connection string.
        </div>
      )}
      {children}
    </AdminShell>
  );
}
