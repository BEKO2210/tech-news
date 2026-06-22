import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { CATEGORY_KEYS } from "@/lib/types";

export function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("categories");
  const year = 2026;

  return (
    <footer className="mt-auto border-t border-line bg-void/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-ink-mid">{t("tagline")}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-live" />
            {t("builtWith")}
          </p>
        </div>

        <div>
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ink-dim">
            {t("sections")}
          </h3>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {CATEGORY_KEYS.slice(0, 8).map((key) => (
              <li key={key}>
                <Link
                  href={`/category/${key}`}
                  className="text-sm text-ink-mid transition-colors hover:text-flux-cyan"
                >
                  {tc(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ink-dim">
            {t("company")}
          </h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/about" className="text-sm text-ink-mid transition-colors hover:text-flux-cyan">
                {t("about")}
              </Link>
            </li>
            <li>
              <a
                href="mailto:belkis.aslani@gmail.com"
                className="text-sm text-ink-mid transition-colors hover:text-flux-cyan"
              >
                {t("contact")}
              </a>
            </li>
            <li>
              <Link href="/impressum" className="text-sm text-ink-mid transition-colors hover:text-flux-cyan">
                {t("imprint")}
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="text-sm text-ink-mid transition-colors hover:text-flux-cyan">
                {t("privacy")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ink-dim sm:flex-row sm:px-6">
          <span>© {year} FLUX. {t("rights")}</span>
          <span className="font-mono">flux://tech.at.the.edge</span>
        </div>
      </div>
    </footer>
  );
}
