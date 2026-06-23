import Image from "next/image";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { ConfigNotice } from "@/components/admin/ConfigNotice";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  if (!isSupabaseConfigured()) {
    return <ConfigNotice missing={["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]} />;
  }

  return (
    <div className="admin-root flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-[#1d1d1f] p-12 text-white lg:flex">
        <Image src="/brand/redi-logo.png" alt="REDI" width={140} height={66} className="h-12 w-auto brightness-0 invert" />
        <div>
          <h2 className="text-4xl font-semibold tracking-tight">Content Studio</h2>
          <p className="mt-4 max-w-md text-lg text-white/60">
            Manage news, opportunities, media, and site settings for the REDI public website.
          </p>
        </div>
        <p className="text-xs text-white/30">REDI Roma Entrepreneurship Development Initiative</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Image src="/brand/redi-logo.png" alt="REDI" width={120} height={57} className="mx-auto h-10 w-auto" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">Sign in</h1>
          <p className="mt-2 text-[15px] text-[#86868b]">Enter your credentials to access the CMS.</p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
