import { Link } from "@/i18n/navigation";
import { CategoryBadge } from "./CategoryBadge";
import { TimeAgo } from "./TimeAgo";
import { Thumb } from "./Thumb";
import type { Article } from "@/lib/types";

interface Props {
  article: Article;
  variant?: "default" | "feature" | "horizontal" | "compact";
  priority?: boolean;
}

export function ArticleCard({ article, variant = "default", priority = false }: Props) {
  const href = `/article/${article.id}`;

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-surface/60"
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          <Thumb article={article} sizes="64px" />
        </div>
        <div className="min-w-0">
          <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-flux-cyan">
            {article.title}
          </h4>
          <div className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase text-ink-dim">
            <span>{article.source}</span>
            <span>·</span>
            <TimeAgo iso={article.publishedAt} />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={href}
        className="group ring-gradient flex gap-4 overflow-hidden rounded-2xl border border-line bg-surface/40 p-3 transition-colors hover:bg-surface/70"
      >
        <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-xl sm:w-44">
          <Thumb article={article} sizes="(max-width:640px) 128px, 176px" />
        </div>
        <div className="flex min-w-0 flex-col justify-center py-1">
          <CategoryBadge category={article.category} />
          <h3 className="mt-2 line-clamp-2 font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-flux-cyan sm:text-lg">
            {article.title}
          </h3>
          <div className="mt-2 flex items-center gap-2 font-mono text-[11px] uppercase text-ink-dim">
            <span className="text-ink-mid">{article.source}</span>
            <span>·</span>
            <TimeAgo iso={article.publishedAt} />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "feature") {
    return (
      <Link
        href={href}
        className="group ring-gradient relative flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-3xl border border-line"
      >
        <Thumb article={article} sizes="(max-width:1024px) 100vw, 66vw" priority={priority} />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-transparent" />
        <div className="relative p-6 sm:p-8">
          <CategoryBadge category={article.category} size="md" />
          <h2 className="mt-3 max-w-3xl font-display text-2xl font-bold leading-tight tracking-tight text-ink transition-colors group-hover:text-flux-cyan sm:text-4xl">
            {article.title}
          </h2>
          <p className="mt-3 line-clamp-2 max-w-2xl text-sm text-ink-mid sm:text-base">
            {article.summary}
          </p>
          <div className="mt-4 flex items-center gap-3 font-mono text-xs uppercase text-ink-dim">
            <span className="text-flux-cyan">{article.source}</span>
            <span>·</span>
            <TimeAgo iso={article.publishedAt} />
            <span>·</span>
            <span>{article.readingTime} min</span>
          </div>
        </div>
      </Link>
    );
  }

  // default
  return (
    <Link
      href={href}
      className="group ring-gradient flex flex-col overflow-hidden rounded-2xl border border-line bg-surface/40 transition-all duration-300 hover:-translate-y-1 hover:bg-surface/70"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Thumb article={article} sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" priority={priority} />
        <div className="absolute left-3 top-3">
          <CategoryBadge category={article.category} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-3 font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-flux-cyan">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink-mid">{article.summary}</p>
        <div className="mt-auto flex items-center gap-2 pt-4 font-mono text-[11px] uppercase text-ink-dim">
          <span className="text-ink-mid">{article.source}</span>
          <span>·</span>
          <TimeAgo iso={article.publishedAt} />
          <span className="ml-auto">{article.readingTime} min</span>
        </div>
      </div>
    </Link>
  );
}
