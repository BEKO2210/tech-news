import { Link } from "@/i18n/navigation";
import { TimeAgo } from "./TimeAgo";
import { CATEGORY_ACCENT, type Article } from "@/lib/types";

export function TrendingRail({ articles }: { articles: Article[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a, i) => {
        const accent = CATEGORY_ACCENT[a.category];
        return (
          <Link
            key={a.id}
            href={`/article/${a.id}`}
            className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-line bg-surface/40 p-4 transition-colors hover:bg-surface/70"
          >
            <span
              className="font-display text-3xl font-black leading-none opacity-90"
              style={{ color: accent }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h4 className="line-clamp-2 font-semibold leading-snug text-ink transition-colors group-hover:text-flux-cyan">
                {a.title}
              </h4>
              <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] uppercase text-ink-dim">
                <span className="text-ink-mid">{a.source}</span>
                <span>·</span>
                <TimeAgo iso={a.publishedAt} />
              </div>
            </div>
            <span
              className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full"
              style={{ background: accent }}
            />
          </Link>
        );
      })}
    </div>
  );
}
