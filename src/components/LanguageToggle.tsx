"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      className="relative flex items-center rounded-full border border-line bg-surface/60 p-0.5 text-xs font-mono font-semibold"
      data-pending={isPending}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-pressed={l === locale}
          aria-label={`Switch to ${l.toUpperCase()}`}
          className={`relative z-10 cursor-pointer rounded-full px-2.5 py-1 uppercase transition-colors ${
            l === locale ? "text-void" : "text-ink-mid hover:text-ink"
          }`}
        >
          {l === locale && (
            <span className="absolute inset-0 -z-10 rounded-full flux-gradient" />
          )}
          {l}
        </button>
      ))}
    </div>
  );
}
