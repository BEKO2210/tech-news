"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArticleCard } from "./ArticleCard";
import { usePrefs } from "./personalization/PrefsProvider";
import { CATEGORY_KEYS, CATEGORY_ACCENT, type Article, type CategoryKey } from "@/lib/types";

const PAGE = 9;

export function Feed({
  articles,
  initialQuery = "",
}: {
  articles: Article[];
  initialQuery?: string;
}) {
  const t = useTranslations("feed");
  const tc = useTranslations("categories");
  const reduce = useReducedMotion();
  const { prefs } = usePrefs();
  const [active, setActive] = useState<CategoryKey | "all">("all");
  const [visible, setVisible] = useState(12);
  const query = initialQuery.toLowerCase();

  const filtered = useMemo(() => {
    const list = articles.filter((a) => {
      const catOk = active === "all" || a.category === active;
      const qOk =
        !query ||
        a.title.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query) ||
        a.source.toLowerCase().includes(query);
      return catOk && qOk;
    });
    // Personalized ordering: surface the user's favourite topics first
    // (stable sort keeps recency within each group).
    if (active === "all" && prefs.topics.length) {
      const fav = new Set(prefs.topics);
      return [...list].sort(
        (a, b) => (fav.has(b.category) ? 1 : 0) - (fav.has(a.category) ? 1 : 0),
      );
    }
    return list;
  }, [articles, active, query, prefs.topics]);

  const shown = filtered.slice(0, visible);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {t("latestHeadline")}
        </h2>
        <p className="max-w-2xl text-ink-mid">{t("latestSub")}</p>
      </div>

      {/* Category filter */}
      <div className="mt-7 flex flex-wrap gap-2">
        <FilterPill active={active === "all"} onClick={() => { setActive("all"); setVisible(12); }}>
          {tc("all")}
        </FilterPill>
        {CATEGORY_KEYS.map((key) => (
          <FilterPill
            key={key}
            active={active === key}
            accent={CATEGORY_ACCENT[key]}
            onClick={() => { setActive(key); setVisible(12); }}
          >
            {tc(key)}
          </FilterPill>
        ))}
      </div>

      {query && (
        <p className="mt-4 font-mono text-sm text-ink-mid">
          {filtered.length} → <span className="text-flux-cyan">&quot;{initialQuery}&quot;</span>
        </p>
      )}

      {shown.length === 0 ? (
        <p className="mt-16 text-center text-ink-dim">{t("noResults")}</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((a, i) => (
              <motion.div
                key={a.id}
                layout
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: reduce ? 0 : (i % PAGE) * 0.04 }}
              >
                <ArticleCard article={a} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {visible < filtered.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE)}
            className="group relative cursor-pointer overflow-hidden rounded-full border border-line bg-surface/50 px-8 py-3 font-semibold text-ink transition-colors hover:border-flux-blue/60"
          >
            <span className="relative z-10">{t("loadMore")}</span>
            <span className="absolute inset-0 -z-0 translate-y-full bg-flux-blue/10 transition-transform duration-300 group-hover:translate-y-0" />
          </button>
        </div>
      )}
    </section>
  );
}

function FilterPill({
  children,
  active,
  accent,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  accent?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
        active
          ? "border-transparent text-void"
          : "border-line text-ink-mid hover:border-ink-dim hover:text-ink"
      }`}
      style={active ? { background: accent ?? "#c6f03c" } : undefined}
    >
      {children}
    </button>
  );
}
