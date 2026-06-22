# ⚡ FLUX — Tech News at the Edge

A spectacular, bilingual (DE/EN) tech-news platform that **auto-aggregates** the world's best tech sources via RSS, **AI-summarizes** them, and presents everything in a dark-mode-first, "edge of tech" UI.

> Design system: **Pulse — Electric Lime**. Built with Next.js 16, Tailwind v4, next-intl & Framer Motion.

---

## ✨ Features

- **Auto-aggregation** — pulls real articles from 13+ top sources (The Verge, TechCrunch, Ars Technica, WIRED, Engadget, The Decoder, heise, t3n, Golem, netzpolitik, Caschys Blog, VentureBeat …).
- **Bilingual** — full DE/EN i18n with a language toggle; locale-aware feeds.
- **AI TL;DR** — per-article summaries via any OpenAI-compatible LLM (Kimi/Moonshot, OpenAI, …). Falls back gracefully to the source excerpt when no key is set.
- **Auto-categorization** — keyword engine sorts articles into AI, Hardware, Software, Space, Science, Gaming, Crypto, Security, Business, Mobile.
- **Self-refreshing** — ISR (15 min) + Vercel Cron force-refresh every 30 min. Set & forget.
- **Spectacular UI** — glass navbar, live ticker, bento hero, trending rail, scroll-reveal stagger, magnetic CTAs, ⌘K search, reading-progress bar, save/share.
- **Robust** — per-source error isolation, charset auto-detection (ISO-8859-1/UTF-8), ad/sponsored filtering, image extraction with gradient fallback.

## 🎨 Design system — "Pulse · Electric Lime"

| Token | Value | Role |
|------|-------|------|
| `void` | `#07090C` | background |
| `surface` | `#11151C` | cards |
| accent (lime) | `#C6F03C` | primary / links / hover |
| mint | `#7CFFB2` | secondary / AI / live |
| breaking | `#FF6B35` | breaking / urgency |
| ink | `#EAF0F8` | text |

Fonts: **Space Grotesk** (display) · **Inter** (body) · **JetBrains Mono** (meta).

## 🚀 Getting started

```bash
npm install
cp .env.example .env.local   # optional: add an LLM key for AI summaries
npm run dev                  # http://localhost:3000  (redirects to /de)
```

## 🔑 Environment variables

See [`.env.example`](./.env.example). All optional — the site runs without any keys (AI summaries simply fall back to source excerpts).

| Var | Purpose |
|-----|---------|
| `LLM_API_KEY` | OpenAI-compatible key for AI TL;DR (e.g. Kimi/Moonshot). |
| `LLM_BASE_URL` | API base, default `https://api.moonshot.ai/v1`. |
| `LLM_MODEL` | e.g. `moonshot-v1-8k` or `gpt-4o-mini`. |
| `CRON_SECRET` | Protects `/api/cron`; Vercel sends it automatically. |

> **Never commit real keys.** Set them in Vercel → Settings → Environment Variables.

## ☁️ Deploy on Vercel

1. Push this repo to GitHub.
2. Import it on [vercel.com/new](https://vercel.com/new).
3. (Optional) add the env vars above.
4. Deploy. The cron (`vercel.json`) auto-refreshes feeds every 30 min.

## 🧱 Architecture

```
src/
  app/[locale]/        home · article/[id] · category/[slug]   (i18n routes)
  app/api/summarize    OpenAI-compatible AI TL;DR (env key)
  app/api/cron         revalidates feed cache (Vercel Cron)
  components/          Navbar, Hero, Feed, ArticleCard, Ticker, …
  lib/feeds.ts         RSS fetch · parse · categorize · cache
  i18n/                next-intl routing/request/navigation
messages/              de.json · en.json
```

---

Built with AI — auto-curated. `flux://tech.at.the.edge`
