import Image from "next/image";
import { Shield, Database, KeyRound } from "lucide-react";

export function ConfigNotice({ missing }: { missing?: string[] }) {
  const vars = missing ?? [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "DATABASE_URL",
  ];

  return (
    <div className="admin-root flex min-h-screen items-center justify-center px-6 py-16">
      <div className="admin-card max-w-lg p-10 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1b4332]/10">
          <Shield className="h-7 w-7 text-[#1b4332]" />
        </div>
        <Image src="/brand/redi-logo.png" alt="REDI" width={120} height={57} className="mx-auto mb-6 h-10 w-auto" />
        <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">CMS setup required</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#86868b]">
          The admin panel is installed but needs environment variables before you can sign in and manage content.
        </p>

        <div className="mt-8 rounded-xl bg-[#fafafa] p-5 text-left">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            <KeyRound className="h-3.5 w-3.5" />
            Required variables
          </p>
          <ul className="space-y-2">
            {vars.map((v) => (
              <li key={v}>
                <code className="rounded-md bg-white px-2 py-1 text-xs text-[#1b4332] shadow-sm">{v}</code>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-xl bg-[#fafafa] p-5 text-left">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            <Database className="h-3.5 w-3.5" />
            Activation steps
          </p>
          <ol className="list-decimal space-y-2 pl-4 text-sm text-[#86868b]">
            <li>Add vars to <code className="text-xs">.env.local</code> and Vercel project settings</li>
            <li>Run <code className="text-xs">npm run db:migrate</code></li>
            <li>Run <code className="text-xs">npm run db:seed</code> to import existing content</li>
            <li>Confirm admin email in Supabase Auth dashboard</li>
            <li>Redeploy and visit <code className="text-xs">/admin/login</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
