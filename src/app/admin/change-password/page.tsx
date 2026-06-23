import Image from "next/image";
import { redirect } from "next/navigation";
import { isSupabaseConfigured, getAdminUser } from "@/lib/supabase/server";
import { getAdminSession, mustChangePassword } from "@/lib/admin/auth";
import { ConfigNotice } from "@/components/admin/ConfigNotice";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  if (!isSupabaseConfigured()) {
    return <ConfigNotice missing={["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]} />;
  }

  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  if (!mustChangePassword(session.profile)) {
    redirect("/admin");
  }

  return (
    <div className="admin-root flex min-h-screen items-center justify-center px-6 py-16">
      <div className="admin-card w-full max-w-md p-10">
        <Image src="/brand/redi-logo.png" alt="REDI" width={120} height={57} className="mx-auto mb-6 h-10 w-auto" />
        <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Set your password</h1>
        <p className="mt-2 text-[15px] text-[#86868b]">
          For security, choose a new password before accessing the CMS. Use at least 10 characters.
        </p>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
