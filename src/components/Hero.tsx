import { getTranslations } from "next-intl/server";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/lib/types";

export async function Hero({
  hero,
  bento,
}: {
  hero: Article;
  bento: Article[];
}) {
  const t = await getTranslations("hero");

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
      <div className="mb-6 flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-flux-cyan opacity-60 animate-[pulse-live_1.8s_ease-in-out_infinite]" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-flux-cyan" />
        </span>
        <h1 className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-ink-mid">
          {t("eyebrow")}
        </h1>
        <span className="h-px flex-1 bg-gradient-to-r from-line to-transparent" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ArticleCard article={hero} variant="feature" priority />
        </div>
        <div className="flex flex-col gap-5">
          {bento.slice(0, 2).map((a) => (
            <div key={a.id} className="flex-1">
              <ArticleCard article={a} variant="horizontal" />
            </div>
          ))}
        </div>
      </div>

      {bento.length > 2 && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {bento.slice(2, 4).map((a) => (
            <ArticleCard key={a.id} article={a} variant="horizontal" />
          ))}
        </div>
      )}
    </section>
  );
}
