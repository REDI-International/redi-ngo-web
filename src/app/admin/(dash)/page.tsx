import Link from "next/link";
import { listOpportunities, listNews, listGallery, listNav } from "@/db/queries";

export default async function AdminDashboard() {
  const [opps, news, gallery, nav] = await Promise.all([
    listOpportunities(),
    listNews(),
    listGallery(),
    listNav(),
  ]);

  const tenders = opps.filter((o) => o.type === "tender" || o.type === "grant").length;
  const jobs = opps.filter((o) => o.type === "job").length;

  const cards = [
    { href: "/admin/tenders", label: "Tenders & Grants", count: tenders },
    { href: "/admin/jobs", label: "Jobs", count: jobs },
    { href: "/admin/news", label: "News", count: news.length },
    { href: "/admin/media", label: "Media gallery", count: gallery.length },
    { href: "/admin/menu", label: "Menu items", count: nav.length },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary">Dashboard</h1>
      <p className="mt-1 text-sm text-text-muted">Manage all content from one place.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-surface-dark bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-medium text-text-muted">{c.label}</p>
            <p className="mt-2 font-heading text-3xl font-bold text-primary">{c.count}</p>
          </Link>
        ))}
      </div>

      {opps.length === 0 && news.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-surface-dark bg-white p-6 text-sm text-text-muted">
          No content in the database yet. Run <code className="rounded bg-surface px-1.5 py-0.5">npm run db:seed</code> to
          import the existing site content, or create items using the sections above.
        </div>
      )}
    </div>
  );
}
