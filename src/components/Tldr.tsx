"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export function Tldr({
  id,
  title,
  summary,
  link,
}: {
  id: string;
  title: string;
  summary: string;
  link: string;
}) {
  const t = useTranslations("article");
  const locale = useLocale();
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ai, setAi] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title, summary, link, locale }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setText(d.summary || summary);
        setAi(Boolean(d.ai));
      })
      .catch(() => !cancelled && setText(summary))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, title, summary, link, locale]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-flux-violet/30 bg-flux-violet/5 p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-flux-violet/20 blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <SparkIcon />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-flux-violet">
            {loading ? t("tldrGenerating") : t("tldr")}
          </span>
        </div>
        {loading ? (
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded shimmer" />
            <div className="h-3 w-11/12 rounded shimmer" />
            <div className="h-3 w-3/4 rounded shimmer" />
          </div>
        ) : (
          <p className="mt-3 text-[15px] leading-relaxed text-ink">{text}</p>
        )}
        {!loading && ai && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-ink-dim">
            ✦ AI-generated
          </p>
        )}
      </div>
    </div>
  );
}

function SparkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-flux-violet">
      <path
        d="M12 2l1.8 5.6L19 9.4l-5.2 1.8L12 17l-1.8-5.8L5 9.4l5.2-1.8L12 2z"
        fill="currentColor"
      />
    </svg>
  );
}
