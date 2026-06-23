import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface EmpowermentStatementProps {
  title: string;
  body: string;
  highlight: string;
  cta: string;
  ctaHref: string;
}

export function EmpowermentStatement({ title, body, highlight, cta, ctaHref }: EmpowermentStatementProps) {
  return (
    <section className="border-y border-surface-dark bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-bold leading-tight text-text lg:text-4xl">{title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-text-muted">{body}</p>
            <p className="mt-4 rounded-xl border border-primary/10 bg-primary/5 px-5 py-4 text-base font-medium leading-relaxed text-primary">
              {highlight}
            </p>
            <Link
              href={ctaHref}
              className="mt-8 inline-flex rounded-full border-2 border-primary px-7 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              {cta}
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/home/entrepreneur-collage.png"
              alt=""
              width={1200}
              height={400}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
