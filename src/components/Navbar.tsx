"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { CATEGORY_KEYS, CATEGORY_ACCENT } from "@/lib/types";

export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("categories");
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close overlays on route change
  useEffect(() => {
    setMenuOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // ⌘K / Ctrl+K to open search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    setSearchOpen(false);
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "glass-strong" : "border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link href="/" aria-label="FLUX home" className="shrink-0">
              <Logo />
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-mid transition-colors hover:text-ink"
              >
                {t("latest")}
              </Link>
              <div
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
                className="relative"
              >
                <button
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-mid transition-colors hover:text-ink"
                  aria-expanded={megaOpen}
                >
                  {t("categories")}
                  <svg width="12" height="12" viewBox="0 0 12 12" className={`transition-transform ${megaOpen ? "rotate-180" : ""}`}>
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </button>
                {megaOpen && (
                  <div className="absolute left-0 top-full w-[420px] pt-2">
                    <div className="glass grid grid-cols-2 gap-1 rounded-2xl p-3 shadow-2xl">
                      {CATEGORY_KEYS.map((key) => (
                        <Link
                          key={key}
                          href={`/category/${key}`}
                          className="group flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-surface-2"
                        >
                          <span
                            className="h-2 w-2 rounded-full transition-transform group-hover:scale-150"
                            style={{ background: CATEGORY_ACCENT[key] }}
                          />
                          <span className="text-sm font-medium text-ink">{tc(key)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <a
                href="#trending"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-mid transition-colors hover:text-ink"
              >
                {t("trending")}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label={t("search")}
              className="flex items-center gap-2 rounded-full border border-line bg-surface/50 px-3 py-2 text-sm text-ink-mid transition-colors hover:border-flux-blue/50 hover:text-ink"
            >
              <SearchIcon />
              <span className="hidden font-mono text-xs xl:inline">⌘K</span>
            </button>
            <LanguageToggle />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={t("menu")}
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/50 text-ink lg:hidden"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-line glass-strong lg:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <Link href="/" className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink">
                {t("latest")}
              </Link>
              <a href="#trending" className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink">
                {t("trending")}
              </a>
              <div className="mt-2 grid grid-cols-2 gap-1 border-t border-line pt-3">
                {CATEGORY_KEYS.map((key) => (
                  <Link
                    key={key}
                    href={`/category/${key}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-mid"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_ACCENT[key] }} />
                    {tc(key)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-void/70 px-4 pt-[18vh] backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={onSearch}
            className="glass w-full max-w-xl rounded-2xl p-2 shadow-2xl ring-gradient"
          >
            <div className="flex items-center gap-3 px-3">
              <SearchIcon className="text-flux-cyan" />
              <input
                ref={inputRef}
                type="search"
                placeholder={t("searchPlaceholder")}
                className="w-full bg-transparent py-3.5 text-lg text-ink outline-none placeholder:text-ink-dim"
              />
              <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-dim sm:block">
                ESC
              </kbd>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
