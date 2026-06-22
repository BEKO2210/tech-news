"use client";

import { useTranslations } from "next-intl";
import { CATEGORY_ACCENT, type CategoryKey } from "@/lib/types";

export function CategoryBadge({
  category,
  size = "sm",
}: {
  category: CategoryKey;
  size?: "sm" | "md";
}) {
  const t = useTranslations("categories");
  const accent = CATEGORY_ACCENT[category];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-semibold uppercase tracking-wider ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      }`}
      style={{
        color: accent,
        borderColor: `${accent}40`,
        background: `${accent}12`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
      {t(category)}
    </span>
  );
}
