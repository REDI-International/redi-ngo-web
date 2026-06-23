import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { getTeam } from "@/lib/content";

export async function StaticAboutContent({ locale }: { locale: string }) {
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const team = getTeam();
  const board = team.filter((m) => m.group === "board");
  const staff = team.filter((m) => m.group === "team");

  return (
    <>
      <section className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-heading text-4xl font-bold">{t("title")}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary">{t("missionTitle")}</h2>
            <p className="mt-4 text-text-muted leading-relaxed">{t("missionText")}</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary">{t("visionTitle")}</h2>
            <p className="mt-4 text-text-muted leading-relaxed">{t("visionText")}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-primary">{t("teamTitle")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {staff.map((member) => (
              <div key={member.slug} className="rounded-2xl border border-surface-dark p-5 text-center">
                {member.image && (
                  <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-surface">
                    <Image src={member.image} alt={member.name} fill className="object-cover" sizes="96px" />
                  </div>
                )}
                <p className="font-heading font-bold text-primary">{member.name}</p>
                <p className="mt-1 text-sm text-text-muted">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-primary">{t("boardTitle")}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {board.map((member) => (
            <div key={member.slug} className="flex items-center gap-4 rounded-2xl border border-surface-dark p-5">
              {member.image && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface">
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="64px" />
                </div>
              )}
              <div>
                <p className="font-heading font-bold text-primary">{member.name}</p>
                <p className="text-sm text-text-muted">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
