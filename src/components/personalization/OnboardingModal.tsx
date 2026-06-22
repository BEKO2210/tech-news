"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePrefs } from "./PrefsProvider";
import { LogoMark } from "@/components/Logo";
import {
  CATEGORY_KEYS,
  CATEGORY_ACCENT,
  type CategoryKey,
} from "@/lib/types";
import type { Tone, Length, Level } from "@/lib/prefs";

export function OnboardingModal() {
  const t = useTranslations("onboarding");
  const tc = useTranslations("categories");
  const { prefs, open, setOpen, save } = usePrefs();

  const [step, setStep] = useState(0);
  const [topics, setTopics] = useState<CategoryKey[]>(prefs.topics);
  const [tone, setTone] = useState<Tone>(prefs.tone);
  const [length, setLength] = useState<Length>(prefs.length);
  const [level, setLevel] = useState<Level>(prefs.level);

  // Re-seed drafts whenever the modal opens (e.g. re-opened from navbar).
  useEffect(() => {
    if (open) {
      setStep(0);
      setTopics(prefs.topics);
      setTone(prefs.tone);
      setLength(prefs.length);
      setLevel(prefs.level);
    }
  }, [open, prefs]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  function finish() {
    save({ topics, tone, length, level, onboarded: true });
    setOpen(false);
  }

  function toggleTopic(k: CategoryKey) {
    setTopics((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k],
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-void/80 backdrop-blur-md"
        onClick={() => prefs.onboarded && setOpen(false)}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.21, 0.5, 0.3, 1] }}
        className="glass ring-gradient relative w-full max-w-lg overflow-hidden rounded-3xl p-6 shadow-2xl sm:p-8"
      >
        {/* header */}
        <div className="flex items-center gap-3">
          <LogoMark className="h-9 w-9 animate-logo" />
          <div>
            <h2 className="font-display text-lg font-bold leading-tight">
              {t("welcome")}
            </h2>
            <p className="text-xs text-ink-mid">{t("intro")}</p>
          </div>
        </div>

        {/* progress */}
        <div className="mt-5 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-flux-cyan" : "bg-line"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-ink-dim">
          {t("step", { n: step + 1 })}
        </p>

        {/* steps */}
        <div className="mt-4 min-h-[210px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
            >
              {step === 0 && (
                <div>
                  <h3 className="font-display text-base font-semibold">{t("topicsQ")}</h3>
                  <p className="mt-1 text-xs text-ink-dim">{t("topicsHint")}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {CATEGORY_KEYS.map((k) => {
                      const active = topics.includes(k);
                      const accent = CATEGORY_ACCENT[k];
                      return (
                        <button
                          key={k}
                          onClick={() => toggleTopic(k)}
                          className="rounded-full border px-3 py-1.5 text-sm font-medium transition-all"
                          style={{
                            borderColor: active ? accent : "var(--color-line)",
                            background: active ? `${accent}1f` : "transparent",
                            color: active ? accent : "var(--color-ink-mid)",
                          }}
                        >
                          {tc(k)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 1 && (
                <Choice
                  title={t("toneQ")}
                  options={[
                    { v: "casual", label: t("toneCasual") },
                    { v: "neutral", label: t("toneNeutral") },
                    { v: "technical", label: t("toneTechnical") },
                  ]}
                  value={tone}
                  onChange={(v) => setTone(v as Tone)}
                />
              )}

              {step === 2 && (
                <Choice
                  title={t("lengthQ")}
                  options={[
                    { v: "short", label: t("lengthShort"), desc: t("lengthShortD") },
                    { v: "medium", label: t("lengthMedium"), desc: t("lengthMediumD") },
                    { v: "long", label: t("lengthLong"), desc: t("lengthLongD") },
                  ]}
                  value={length}
                  onChange={(v) => setLength(v as Length)}
                />
              )}

              {step === 3 && (
                <Choice
                  title={t("levelQ")}
                  options={[
                    { v: "beginner", label: t("levelBeginner"), desc: t("levelBeginnerD") },
                    { v: "pro", label: t("levelPro"), desc: t("levelProD") },
                  ]}
                  value={level}
                  onChange={(v) => setLevel(v as Level)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* nav */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => (step === 0 ? setOpen(false) : setStep((s) => s - 1))}
            className="rounded-full px-4 py-2 text-sm text-ink-mid transition-colors hover:text-ink"
          >
            {step === 0 ? t("skip") : t("back")}
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="rounded-full flux-gradient px-6 py-2.5 text-sm font-semibold text-void transition-transform active:scale-95"
            >
              {t("next")}
            </button>
          ) : (
            <button
              onClick={finish}
              className="rounded-full flux-gradient px-6 py-2.5 text-sm font-semibold text-void transition-transform active:scale-95"
            >
              {t("finish")} 🚀
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Choice({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { v: string; label: string; desc?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <div className="mt-4 grid gap-2.5">
        {options.map((o) => {
          const active = value === o.v;
          return (
            <button
              key={o.v}
              onClick={() => onChange(o.v)}
              className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-flux-cyan bg-flux-cyan/10"
                  : "border-line bg-surface/40 hover:bg-surface/70"
              }`}
            >
              <div>
                <div className={`font-semibold ${active ? "text-flux-cyan" : "text-ink"}`}>
                  {o.label}
                </div>
                {o.desc && <div className="text-xs text-ink-dim">{o.desc}</div>}
              </div>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  active ? "border-flux-cyan bg-flux-cyan text-void" : "border-line"
                }`}
              >
                {active && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
