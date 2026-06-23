import Image from "next/image";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { ConfigNotice } from "@/components/admin/ConfigNotice";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  if (!isSupabaseConfigured()) return <ConfigNotice />;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image src="/brand/redi-logo.png" alt="REDI" width={400} height={189} className="h-12 w-auto" priority />
        </div>
        <div className="rounded-2xl border border-surface-dark bg-white p-8 shadow-sm">
          <h1 className="font-heading text-xl font-bold text-primary">Admin sign in</h1>
          <p className="mt-1 mb-6 text-sm text-text-muted">Manage tenders, jobs, news, media and menus.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
