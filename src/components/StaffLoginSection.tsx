import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import { canEditContent } from "@/lib/admin/can-edit-content";

export async function StaffLoginSection() {
  const t = await getTranslations("home.staffLogin");
  const session = await getAdminSession();
  const isEditor = session !== null && canEditContent(session.role);

  return (
    <section className="border-t border-surface-dark/30 bg-[#f8f9f8]" aria-labelledby="staff-login-heading">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-surface-dark/40 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <h2 id="staff-login-heading" className="font-heading text-base font-semibold text-text">
              {t("title")}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{t("description")}</p>
          </div>
          {isEditor ? (
            <Link
              href="/?edit=1"
              className="shrink-0 rounded-full border-2 border-primary bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light"
            >
              {t("openEditor")}
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="shrink-0 rounded-full border-2 border-primary/25 bg-white px-6 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5"
            >
              {t("signIn")}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
