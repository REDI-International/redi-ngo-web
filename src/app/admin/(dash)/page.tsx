import Link from "next/link";
import { Plus, Clock, ArrowRight } from "lucide-react";
import { getDashboardStats, getRecentEdits } from "@/db/queries";
import { PageHeader, StatCard } from "@/components/admin/ui";
import { siteConfig } from "@/content/site";

const TYPE_LABELS: Record<string, string> = {
  news: "News",
  opportunity: "Opportunity",
  media: "Media",
  nav: "Navigation",
  section: "Page section",
  setting: "Setting",
};

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getDashboardStats(), getRecentEdits(8)]);

  const totalContent = stats.news + stats.tenders + stats.jobs + stats.media;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your content and recent activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard label="News articles" value={stats.news} href="/admin/news" />
        <StatCard label="Tenders & grants" value={stats.tenders} href="/admin/opportunities?type=tender" accent="text-[#003399]" />
        <StatCard label="Job postings" value={stats.jobs} href="/admin/opportunities?type=job" />
        <StatCard label="Media files" value={stats.media} href="/admin/media" accent="text-[#d4a017]" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-6">
          <h2 className="text-lg font-semibold text-[#1d1d1f]">Quick actions</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { href: "/admin/news/new", label: "New article" },
              { href: "/admin/opportunities/new", label: "New opportunity" },
              { href: "/admin/media/new", label: "Upload media" },
              { href: `${siteConfig.url}/en?edit=1`, label: "Open live editor", external: true },
            ].map((action) => (
              action.external ? (
                <a
                  key={action.href}
                  href={action.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-[#fafafa] px-4 py-3 text-sm font-medium text-[#1d1d1f] transition hover:border-[#1b4332]/30 hover:bg-white"
                >
                  <Plus className="h-4 w-4 text-[#1b4332]" />
                  {action.label}
                </a>
              ) : (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-[#fafafa] px-4 py-3 text-sm font-medium text-[#1d1d1f] transition hover:border-[#1b4332]/30 hover:bg-white"
              >
                <Plus className="h-4 w-4 text-[#1b4332]" />
                {action.label}
              </Link>
              )
            ))}
          </div>
        </div>

        <div className="admin-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1d1d1f]">Recent edits</h2>
            <Clock className="h-4 w-4 text-[#86868b]" />
          </div>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-[#86868b]">
              {totalContent === 0
                ? "No content yet. Run npm run db:seed or create your first item."
                : "No recent activity."}
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-black/[0.04]">
              {recent.map((edit) => (
                <li key={`${edit.type}-${edit.id}`}>
                  <Link
                    href={edit.href}
                    className="group flex items-center justify-between py-3 transition hover:text-[#1b4332]"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1d1d1f] group-hover:text-[#1b4332]">{edit.title}</p>
                      <p className="text-xs text-[#86868b]">
                        {TYPE_LABELS[edit.type] ?? edit.type}
                        {edit.updatedAt && ` · ${edit.updatedAt.toLocaleDateString("en-GB")}`}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#86868b] opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
