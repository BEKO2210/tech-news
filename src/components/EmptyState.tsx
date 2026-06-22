import { useTranslations } from "next-intl";
import { LogoMark } from "./Logo";

export function EmptyState() {
  const t = useTranslations("feed");
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <LogoMark className="h-16 w-16 animate-[float_7s_ease-in-out_infinite] opacity-70" />
      <p className="mt-6 font-mono text-sm uppercase tracking-widest text-ink-dim">
        {t("loading")}
      </p>
      <p className="mt-2 text-ink-mid">{t("noResults")}</p>
    </div>
  );
}
