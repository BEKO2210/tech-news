"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function ShareSave({ id, title }: { id: string; title: string }) {
  const t = useTranslations("article");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem("flux:saved") || "[]");
      setSaved(list.includes(id));
    } catch {}
  }, [id]);

  function toggleSave() {
    try {
      const list: string[] = JSON.parse(localStorage.getItem("flux:saved") || "[]");
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      localStorage.setItem("flux:saved", JSON.stringify(next));
      setSaved(next.includes(id));
    } catch {}
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={share}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface/50 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-flux-cyan/50"
      >
        <ShareIcon />
        {copied ? "✓" : t("share")}
      </button>
      <button
        onClick={toggleSave}
        aria-pressed={saved}
        className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
          saved
            ? "border-flux-cyan/60 bg-flux-cyan/10 text-flux-cyan"
            : "border-line bg-surface/50 text-ink hover:border-flux-cyan/50"
        }`}
      >
        <BookmarkIcon filled={saved} />
        {saved ? t("saved") : t("save")}
      </button>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}>
      <path d="M6 4a2 2 0 012-2h8a2 2 0 012 2v18l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
