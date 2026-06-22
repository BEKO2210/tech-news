import { setRequestLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { Feed } from "@/components/Feed";
import { Newsletter } from "@/components/Newsletter";
import { TrendingRail } from "@/components/TrendingRail";
import { getArticles, pickFeatured, trending } from "@/lib/feeds";
import { EmptyState } from "@/components/EmptyState";
import { IntelligenceSection } from "@/components/ui/intelligence-section";

export const revalidate = 900;

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);

  const articles = await getArticles(locale as "de" | "en");

  if (!articles.length) {
    return <EmptyState />;
  }

  const { hero, bento, rest } = pickFeatured(articles);
  const trend = trending(articles, 6);
  const t = await getTranslations("feed");

  return (
    <>
      {hero && <Hero hero={hero} bento={bento} />}

      {/* Trending */}
      <section id="trending" className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {t("trendingNow")}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-line to-transparent" />
        </div>
        <TrendingRail articles={trend} />
      </section>

      <Feed articles={rest} initialQuery={q ?? ""} />

      <IntelligenceSection />

      <Newsletter />
    </>
  );
}
