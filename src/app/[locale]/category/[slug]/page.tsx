import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArticleCard } from "@/components/ArticleCard";
import { Reveal } from "@/components/Reveal";
import { Newsletter } from "@/components/Newsletter";
import { getArticles } from "@/lib/feeds";
import { CATEGORY_KEYS, CATEGORY_ACCENT, type CategoryKey } from "@/lib/types";
import { routing } from "@/i18n/routing";

export const revalidate = 900;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CATEGORY_KEYS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!CATEGORY_KEYS.includes(slug as CategoryKey)) return {};
  const t = await getTranslations({ locale, namespace: "categories" });
  return { title: t(slug as CategoryKey) };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!CATEGORY_KEYS.includes(slug as CategoryKey)) notFound();
  setRequestLocale(locale);

  const key = slug as CategoryKey;
  const accent = CATEGORY_ACCENT[key];
  const all = await getArticles(locale as "de" | "en");
  const articles = all.filter((a) => a.category === key);
  const tc = await getTranslations("categories");

  return (
    <>
      <header className="relative overflow-hidden border-b border-line">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(60rem 30rem at 50% -50%, ${accent}, transparent 70%)` }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink-dim">
            FLUX / {key}
          </span>
          <h1
            className="mt-3 font-display text-4xl font-black tracking-tight sm:text-6xl"
            style={{ color: accent }}
          >
            {tc(key)}
          </h1>
          <p className="mt-2 font-mono text-sm text-ink-mid">
            {articles.length} {locale === "de" ? "Artikel" : "articles"}
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {articles.length === 0 ? (
          <p className="py-20 text-center text-ink-dim">—</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal key={a.id} delay={(i % 6) * 0.05}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <Newsletter />
    </>
  );
}
