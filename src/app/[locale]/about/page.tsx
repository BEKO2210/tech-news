import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "de" ? "Über FLUX" : "About FLUX" };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const de = locale === "de";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink-dim">
        {de ? "Über uns" : "About"}
      </span>
      <h1 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-6xl">
        {de ? "Ein Mensch. " : "One person. "}
        <span className="text-gradient">{de ? "Ein Projekt." : "One project."}</span>
      </h1>

      <div className="mt-12 grid items-start gap-10 md:grid-cols-[280px_1fr]">
        <div className="relative mx-auto w-full max-w-[280px]">
          <div className="ring-gradient relative aspect-[4/5] overflow-hidden rounded-3xl border border-line">
            <Image
              src="/about-belkis.png"
              alt="Belkis Aslani"
              fill
              sizes="280px"
              className="object-cover"
              priority
            />
          </div>
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-flux-cyan/10 blur-2xl" />
        </div>

        <div className="space-y-5 text-lg leading-relaxed text-ink/90">
          <p>
            <span className="font-semibold text-ink">
              {de ? "Hi, ich bin Belkis." : "Hi, I'm Belkis."}
            </span>{" "}
            {de
              ? "FLUX ist mein unabhängiges Einzelentwickler-Projekt — von der ersten Designidee über jede Zeile Code bis zum Deployment alles allein gebaut."
              : "FLUX is my independent solo-developer project — from the first design idea through every line of code to deployment, built entirely on my own."}
          </p>
          <p>
            {de
              ? "Die Idee: Tech-News sollen nicht nur informieren, sondern Spaß machen. Echte Quellen, von KI auf den Punkt gebracht — und auf dich persönlich zugeschnitten."
              : "The idea: tech news shouldn't just inform, it should be fun. Real sources, distilled to the point by AI — and tailored personally to you."}
          </p>

          <ul className="grid gap-3 pt-2 text-base">
            {[
              de ? "Echte Quellen, automatisch aggregiert (13+ Feeds)" : "Real sources, auto-aggregated (13+ feeds)",
              de ? "KI-Zusammenfassungen in deinem Ton & deiner Länge" : "AI summaries in your tone & length",
              de ? "Zweisprachig (DE/EN), dark-mode-first, mobil & Desktop" : "Bilingual (DE/EN), dark-mode-first, mobile & desktop",
              de ? "100 % unabhängig — kein Konzern, kein Tracking" : "100% independent — no corporation, no tracking",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full flux-gradient" />
                <span className="text-ink-mid">{t}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              href="/"
              className="rounded-full flux-gradient px-6 py-3 font-semibold text-void transition-transform active:scale-95"
            >
              {de ? "Zum Feed" : "To the feed"}
            </Link>
            <a
              href="https://github.com/BEKO2210/tech-news"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-6 py-3 font-semibold text-ink transition-colors hover:border-flux-cyan/60"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
