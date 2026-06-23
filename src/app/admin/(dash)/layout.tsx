import { redirect } from "next/navigation";
import { isSupabaseConfigured, getAdminUser } from "@/lib/supabase/server";
import { ConfigNotice } from "@/components/admin/ConfigNotice";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured() || !process.env.DATABASE_URL) {
    return <ConfigNotice />;
  }

  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar email={user.email} />
      <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
    </div>
  );
}
