export function ConfigNotice() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="rounded-2xl border border-surface-dark bg-white p-8 shadow-sm">
        <h1 className="font-heading text-2xl font-bold text-primary">Configure Supabase to enable the admin panel</h1>
        <p className="mt-4 text-text-muted">
          The admin panel is installed but dormant. Add the following environment variables
          (locally in <code className="rounded bg-surface px-1.5 py-0.5 text-sm">.env.local</code> and in
          Vercel), then redeploy:
        </p>
        <ul className="mx-auto mt-5 w-fit space-y-1 text-left text-sm text-text">
          <li><code>NEXT_PUBLIC_SUPABASE_URL</code></li>
          <li><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
          <li><code>SUPABASE_SERVICE_ROLE_KEY</code></li>
          <li><code>DATABASE_URL</code></li>
        </ul>
        <p className="mt-5 text-sm text-text-muted">
          Then run <code className="rounded bg-surface px-1.5 py-0.5">npm run db:migrate</code> and{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">npm run db:seed</code>, and create an admin
          user in the Supabase dashboard (Authentication → Users).
        </p>
      </div>
    </div>
  );
}
