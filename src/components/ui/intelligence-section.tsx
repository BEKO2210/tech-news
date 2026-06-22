"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Rss, Sparkles, LayoutGrid, Copy, Check } from "lucide-react";

type StepKey = "aggregate" | "summarize" | "curate";

interface Step {
  key: StepKey;
  icon: typeof Rss;
  accent: string;
  file: string;
  code: string;
  result: Record<string, unknown>;
}

const STEPS: Step[] = [
  {
    key: "aggregate",
    icon: Rss,
    accent: "#c6f03c",
    file: "feeds.ts",
    code: `// Pull + normalize 13+ live tech feeds in parallel
const sources = SOURCES.filter((s) => s.locale === locale);
const results = await Promise.allSettled(
  sources.map(fetchSource),
);
const articles = results
  .filter((r) => r.status === "fulfilled")
  .flatMap((r) => r.value);`,
    result: {
      sources: 13,
      articles: 247,
      withImages: 198,
      latest: "12s ago",
    },
  },
  {
    key: "summarize",
    icon: Sparkles,
    accent: "#7cffb2",
    file: "api/summarize/route.ts",
    code: `// AI distills each story into a TL;DR — in your language
const res = await fetch(\`\${baseUrl}/chat/completions\`, {
  method: "POST",
  headers: { Authorization: \`Bearer \${apiKey}\` },
  body: JSON.stringify({
    model,
    messages: [{ role: "system", content: editorPrompt(lang) },
               { role: "user", content: article }],
  }),
});`,
    result: {
      tldr: "OpenAI ships a faster, cheaper model …",
      lang: "de",
      sentences: 3,
      ai: true,
    },
  },
  {
    key: "curate",
    icon: LayoutGrid,
    accent: "#f7b733",
    file: "feeds.ts",
    code: `// Auto-categorize, dedupe & rank by recency
const category = categorise(\`\${title} \${summary}\`);
const key = title.toLowerCase().replace(/[^a-z0-9]/g, "");
if (!seen.has(key)) { seen.add(key); deduped.push(a); }
deduped.sort((a, b) =>
  +new Date(b.publishedAt) - +new Date(a.publishedAt));`,
    result: {
      category: "ai",
      trending: true,
      duplicatesRemoved: 18,
      adsFiltered: 6,
    },
  },
];

export function IntelligenceSection() {
  const t = useTranslations("pipeline");
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const step = STEPS[active];

  function copy() {
    navigator.clipboard?.writeText(step.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-20 sm:px-6">
      {/* faint dotted background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #c6f03c 2px, transparent 0), radial-gradient(circle at 75px 75px, #7cffb2 2px, transparent 0)",
          backgroundSize: "100px 100px",
        }}
      />

      <div className="relative">
        <div className="mb-12 text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-ink-dim">
            {t("eyebrow")}
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")} <span className="text-gradient">{t("titleAccent")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink-mid">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Step selector */}
          <div className="flex flex-col gap-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = active === i;
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(i)}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${
                    isActive
                      ? "bg-surface-2"
                      : "border-line bg-surface/40 hover:bg-surface/70"
                  }`}
                  style={isActive ? { borderColor: `${s.accent}66` } : undefined}
                >
                  <span
                    className="absolute left-0 top-0 h-full w-0.5 transition-all"
                    style={{ background: isActive ? s.accent : "transparent" }}
                  />
                  <div className="flex items-start gap-4">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors"
                      style={{
                        background: isActive ? `${s.accent}1f` : "#171e29",
                        color: isActive ? s.accent : "#99a4b8",
                      }}
                    >
                      <Icon size={20} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-ink-dim">
                          0{i + 1}
                        </span>
                        <h3 className="font-display font-semibold text-ink">
                          {t(`steps.${s.key}.title`)}
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-ink-mid">
                        {t(`steps.${s.key}.desc`)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Code + result */}
          <div className="space-y-5 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface/60">
              {/* window chrome */}
              <div className="flex items-center justify-between border-b border-line bg-void/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-breaking/80" />
                    <span className="h-3 w-3 rounded-full bg-[#f7b733]/80" />
                    <span className="h-3 w-3 rounded-full bg-live/80" />
                  </div>
                  <span className="font-mono text-xs text-ink-mid">{step.file}</span>
                </div>
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] text-ink-mid transition-colors hover:text-ink"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? t("copied") : t("copy")}
                </button>
              </div>
              <div className="p-5">
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={active}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-x-auto font-mono text-[12.5px] leading-relaxed text-ink/90"
                  >
                    <code>{step.code}</code>
                  </motion.pre>
                </AnimatePresence>
              </div>
            </div>

            {/* live result */}
            <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/40 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-[pulse-live_1.8s_ease-in-out_infinite] rounded-full bg-live opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-ink-mid">
                  {t("liveResult")}
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.pre
                  key={active}
                  initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-x-auto font-mono text-[12.5px] leading-relaxed"
                  style={{ color: step.accent }}
                >
                  <code>{JSON.stringify(step.result, null, 2)}</code>
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
