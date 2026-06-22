"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function Newsletter() {
  const t = useTranslations("newsletter");
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <section className="relative mx-auto my-20 max-w-7xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/40 p-8 sm:p-14">
        {/* glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-flux-violet/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-flux-cyan/20 blur-3xl" />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-ink-mid">{t("subtitle")}</p>

          {done ? (
            <p className="mt-8 text-lg font-semibold text-live">{t("success")}</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setDone(true);
              }}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
                className="flex-1 rounded-full border border-line bg-void/60 px-5 py-3 text-ink outline-none transition-colors focus:border-flux-cyan placeholder:text-ink-dim"
              />
              <button
                type="submit"
                className="group relative cursor-pointer overflow-hidden rounded-full flux-gradient px-6 py-3 font-semibold text-void transition-transform active:scale-95"
              >
                {t("cta")}
              </button>
            </form>
          )}
          <p className="mt-4 text-xs text-ink-dim">{t("consent")}</p>
        </div>
      </div>
    </section>
  );
}
