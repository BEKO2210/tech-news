"use client";

import { useTranslations } from "next-intl";
import type { Article } from "@/lib/types";

export function Ticker({ items }: { items: Article[] }) {
  const t = useTranslations("nav");
  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <div className="relative z-30 flex items-stretch border-b border-line bg-void/80 backdrop-blur">
      <div className="flex shrink-0 items-center gap-2 border-r border-line bg-breaking/10 px-3 sm:px-4">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-breaking opacity-75 animate-[pulse-live_1.8s_ease-in-out_infinite]" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-breaking" />
        </span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-breaking">
          {t("live")}
        </span>
      </div>
      <div className="group relative flex-1 overflow-hidden">
        <div className="flex w-max gap-8 whitespace-nowrap py-2 animate-[marquee_50s_linear_infinite] group-hover:[animation-play-state:paused]">
          {loop.map((a, i) => (
            <a
              key={`${a.id}-${i}`}
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-ink-mid transition-colors hover:text-ink"
            >
              <span className="text-flux-cyan">▸</span>
              <span className="font-medium">{a.title}</span>
              <span className="font-mono text-[10px] uppercase text-ink-dim">
                {a.source}
              </span>
            </a>
          ))}
        </div>
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-void to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-void to-transparent" />
      </div>
    </div>
  );
}
