"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

function format(iso: string, locale: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const min = Math.round(diff / 60000);
  if (min < 1) return locale === "de" ? "gerade eben" : "just now";
  if (min < 60) return rtf.format(-min, "minute");
  const hrs = Math.round(min / 60);
  if (hrs < 24) return rtf.format(-hrs, "hour");
  const days = Math.round(hrs / 24);
  if (days < 7) return rtf.format(-days, "day");
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(then);
}

export function TimeAgo({ iso, className }: { iso: string; className?: string }) {
  const locale = useLocale();
  const [label, setLabel] = useState(() =>
    new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(new Date(iso)),
  );

  useEffect(() => {
    setLabel(format(iso, locale));
    const id = setInterval(() => setLabel(format(iso, locale)), 60000);
    return () => clearInterval(id);
  }, [iso, locale]);

  return (
    <time dateTime={iso} className={className} suppressHydrationWarning>
      {label}
    </time>
  );
}
