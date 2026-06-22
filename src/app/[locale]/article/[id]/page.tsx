import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CategoryBadge } from "@/components/CategoryBadge";
import { TimeAgo } from "@/components/TimeAgo";
import { Tldr } from "@/components/Tldr";
import { ShareSave } from "@/components/ShareSave";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ArticleCard } from "@/components/ArticleCard";
import { Reveal } from "@/components/Reveal";
import { getArticleById } from "@/lib/feeds";
import { CATEGORY_ACCENT } from "@/lib/types";

export const revalidate = 900;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const data = await getArticleById(locale as "de" | "en", id);
  if (!data) return { title: "Not found" };
  return {
    title: data.article.title,
    description: data.article.summary,
    openGraph: {
      title: data.article.title,
      description: data.article.summary,
      images: data.article.image ? [data.article.image] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const data = await getArticleById(locale as "de" | "en", id);
  if (!data) notFound();
  const { article, related } = data;
  const t = await getTranslations("article");
  const accent = CATEGORY_ACCENT[article.category];

  return (
    <article className="relative">
      <ReadingProgress />

      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-mid transition-colors hover:text-flux-cyan"
        >
          <span>←</span> {t("backToFeed")}
        </Link>

        <div className="mt-6">
          <CategoryBadge category={article.category} size="md" />
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          {article.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase text-ink-dim">
          <span style={{ color: accent }}>{article.source}</span>
          {article.author && (
            <>
              <span>·</span>
              <span>{article.author}</span>
            </>
          )}
          <span>·</span>
          <TimeAgo iso={article.publishedAt} />
          <span>·</span>
          <span>{article.readingTime} min</span>
        </div>

        <div className="mt-6">
          <ShareSave id={article.id} title={article.title} />
        </div>
      </div>

      {article.image && (
        <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-line">
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width:1024px) 100vw, 1024px"
              className="object-cover"
              priority
              unoptimized
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ boxShadow: `inset 0 0 120px ${accent}22` }}
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Tldr id={article.id} title={article.title} summary={article.summary} link={article.link} />

        <div className="prose-flux mt-8 space-y-5 text-lg leading-relaxed text-ink/90">
          <p>{article.summary}</p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface/40 p-5">
          <p className="flex-1 text-sm text-ink-mid">
            {t("publishedBy")}{" "}
            <span className="font-semibold text-ink">{article.source}</span>
          </p>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full flux-gradient px-6 py-3 font-semibold text-void transition-transform active:scale-95"
          >
            {t("readOriginal")}
            <span className="transition-transform group-hover:translate-x-0.5">↗</span>
          </a>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {t("related")}
            </h2>
            <span className="h-px flex-1 bg-gradient-to-r from-line to-transparent" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.05}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
