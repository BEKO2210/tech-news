import Parser from "rss-parser";
import { unstable_cache } from "next/cache";
import { createHash } from "crypto";
import type { Article, CategoryKey } from "./types";

/* ------------------------------------------------------------------ */
/*  Sources                                                            */
/* ------------------------------------------------------------------ */

interface Source {
  id: string;
  name: string;
  url: string;
  locale: "de" | "en";
}

const SOURCES: Source[] = [
  // --- English ---
  { id: "theverge", name: "The Verge", url: "https://www.theverge.com/rss/index.xml", locale: "en" },
  { id: "techcrunch", name: "TechCrunch", url: "https://techcrunch.com/feed/", locale: "en" },
  { id: "arstechnica", name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", locale: "en" },
  { id: "decoder-en", name: "The Decoder", url: "https://the-decoder.com/feed/", locale: "en" },
  { id: "wired", name: "WIRED", url: "https://www.wired.com/feed/rss", locale: "en" },
  { id: "engadget", name: "Engadget", url: "https://www.engadget.com/rss.xml", locale: "en" },
  { id: "venturebeat-ai", name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/", locale: "en" },
  // --- German ---
  { id: "heise", name: "heise online", url: "https://www.heise.de/rss/heise-atom.xml", locale: "de" },
  { id: "t3n", name: "t3n", url: "https://t3n.de/rss.xml", locale: "de" },
  { id: "golem", name: "Golem.de", url: "https://rss.golem.de/rss.php?feed=RSS2.0", locale: "de" },
  { id: "decoder-de", name: "The Decoder", url: "https://the-decoder.de/feed/", locale: "de" },
  { id: "netzpolitik", name: "netzpolitik.org", url: "https://netzpolitik.org/feed/", locale: "de" },
  { id: "caschy", name: "Caschys Blog", url: "https://stadt-bremerhaven.de/feed/", locale: "de" },
];

/* ------------------------------------------------------------------ */
/*  Categorisation                                                     */
/* ------------------------------------------------------------------ */

const CATEGORY_KEYWORDS: [CategoryKey, string[]][] = [
  ["ai", ["artificial intelligence", "künstliche intelligenz", " ai ", "a.i.", "machine learning", " ki ", "ki-", "llm", "gpt", "openai", "chatgpt", "gemini", "claude", "anthropic", "mistral", "neural", "deep learning", "copilot", "sprachmodell", "language model", "midjourney"]],
  ["space", ["spacex", "nasa", "rocket", "rakete", "satellite", "satellit", " mars", " mond", " moon", "astronom", "orbit", "starship", " esa ", "raumfahrt", "weltraum"]],
  ["crypto", ["bitcoin", "ethereum", "blockchain", "web3", " nft", "krypto", "crypto", "stablecoin", "token"]],
  ["security", ["malware", "ransomware", "vulnerabilit", "sicherheitslücke", "exploit", "phishing", "datenleck", "data breach", "cyberangriff", "cyberattack", " hack", "zero-day", "ddos"]],
  ["gaming", ["playstation", "xbox", "nintendo", " steam ", "konsole", "console", "videogame", "video game", "videospiel", " gaming", "game pass"]],
  ["mobile", ["iphone", "android", " ios ", "ipados", "pixel", "galaxy", "smartphone", "ipad", "app store", "play store"]],
  ["hardware", ["nvidia", " amd", "intel", "qualcomm", " gpu", " cpu", "prozessor", "processor", "chip", "silicon", " arm ", "raspberry", " ssd", " ram ", "laptop", "grafikkarte"]],
  ["science", ["wissenschaft", "research", "studie", " study", "physics", "physik", "biolog", "climate", "klima", "quantum", "quanten", "fusion", "energy", "energie", "forsch"]],
  ["business", ["startup", "funding", " ipo", "acquisition", "übernahme", "milliarden", "billion", "revenue", "umsatz", "aktie", " stock", " ceo", "layoff", "entlassung"]],
  ["software", ["software", " app ", "open source", "linux", "windows", "macos", "browser", " api", "framework", "programming", "github", "update", "release", "open-source"]],
];

function categorise(text: string): CategoryKey {
  const t = ` ${text.toLowerCase()} `;
  for (const [cat, words] of CATEGORY_KEYWORDS) {
    if (words.some((w) => t.includes(w))) return cat;
  }
  return "software";
}

/* ------------------------------------------------------------------ */
/*  Parsing helpers                                                    */
/* ------------------------------------------------------------------ */

type FeedItem = {
  title?: string;
  link?: string;
  creator?: string;
  author?: string;
  pubDate?: string;
  isoDate?: string;
  contentSnippet?: string;
  content?: string;
  contentEncoded?: string;
  enclosure?: { url?: string; type?: string };
  mediaContent?: { $?: { url?: string; medium?: string; type?: string } }[];
  mediaThumbnail?: { $?: { url?: string } }[];
};

const parser: Parser<unknown, FeedItem> = new Parser({
  timeout: 9000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; FluxNewsBot/1.0; +https://flux.news)",
    Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
      ["content:encoded", "contentEncoded"],
      ["dc:creator", "creator"],
    ],
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&#x2019;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** Trim to a clean sentence/word boundary instead of cutting mid-word. */
function excerpt(html: string, max = 460): string {
  const t = stripHtml(html);
  if (t.length <= max) return t;
  const slice = t.slice(0, max);
  const sentenceEnd = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? "),
  );
  if (sentenceEnd > max * 0.55) return slice.slice(0, sentenceEnd + 1);
  const wordEnd = slice.lastIndexOf(" ");
  return (wordEnd > 0 ? slice.slice(0, wordEnd) : slice).trim() + "…";
}

function extractImage(item: FeedItem): string | undefined {
  if (item.enclosure?.url && /^https/.test(item.enclosure.url) && (!item.enclosure.type || item.enclosure.type.startsWith("image"))) {
    return item.enclosure.url;
  }
  const mc = item.mediaContent?.find((m) => m.$?.url && (!m.$.medium || m.$.medium === "image") && (!m.$.type || m.$.type.startsWith("image")));
  if (mc?.$?.url) return mc.$.url;
  if (item.mediaThumbnail?.[0]?.$?.url) return item.mediaThumbnail[0].$.url;
  const html = item.contentEncoded || item.content || "";
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (m && /^https/.test(m[1])) return m[1];
  return undefined;
}

function hash(s: string): string {
  return createHash("sha1").update(s).digest("hex").slice(0, 12);
}

function readingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const AD_PATTERNS = [
  /^anzeige[:\s]/i,
  /^\[?sponsored\]?/i,
  /^sponsored:/i,
  /^werbung[:\s]/i,
  /^promotion[:\s]/i,
  /^\[?advertorial\]?/i,
  /gewinnspiel/i,
  /^deal[:\s]/i,
];

function isAd(title: string): boolean {
  const t = stripHtml(title);
  return AD_PATTERNS.some((re) => re.test(t));
}

/* ------------------------------------------------------------------ */
/*  Fetch + normalise                                                  */
/* ------------------------------------------------------------------ */

async function fetchSource(source: Source): Promise<Article[]> {
  try {
    const res = await fetch(source.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; FluxNewsBot/1.0; +https://flux.news)",
        Accept:
          "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
      next: { revalidate: 900 },
    });
    if (!res.ok) return [];

    // Robust charset handling: some German feeds are ISO-8859-1 / windows-1252.
    const buf = await res.arrayBuffer();
    let charset = "utf-8";
    const ct = res.headers.get("content-type") || "";
    const ctMatch = ct.match(/charset=([^;]+)/i);
    if (ctMatch) charset = ctMatch[1].trim().toLowerCase();
    const head = new TextDecoder("ascii").decode(buf.slice(0, 200));
    const xmlMatch = head.match(/encoding=["']([^"']+)["']/i);
    if (xmlMatch) charset = xmlMatch[1].trim().toLowerCase();
    let xml: string;
    try {
      xml = new TextDecoder(charset).decode(buf);
    } catch {
      xml = new TextDecoder("utf-8").decode(buf);
    }

    const feed = await parser.parseString(xml);

    return (feed.items || [])
      .filter((it) => it.title && it.link && !isAd(it.title))
      .slice(0, 25)
      .map((it): Article => {
        const rawSummary = it.contentSnippet || it.content || it.contentEncoded || "";
        const summary = excerpt(rawSummary);
        const title = stripHtml(it.title || "");
        const published = it.isoDate || it.pubDate || new Date(0).toISOString();
        return {
          id: hash(it.link || title),
          title,
          link: it.link || "#",
          source: source.name,
          sourceId: source.id,
          author: it.creator || it.author,
          category: categorise(`${title} ${summary}`),
          summary,
          image: extractImage(it),
          publishedAt: new Date(published).toISOString(),
          locale: source.locale,
          readingTime: readingTime(summary),
        };
      });
  } catch {
    return [];
  }
}

async function loadAll(locale: "de" | "en"): Promise<Article[]> {
  const sources = SOURCES.filter((s) => s.locale === locale);
  const results = await Promise.allSettled(sources.map(fetchSource));
  const articles = results
    .filter((r): r is PromiseFulfilledResult<Article[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  // Dedupe by normalised title.
  const seen = new Set<string>();
  const deduped: Article[] = [];
  for (const a of articles) {
    const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
    if (key && !seen.has(key)) {
      seen.add(key);
      deduped.push(a);
    }
  }

  deduped.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  return deduped;
}

/* ------------------------------------------------------------------ */
/*  Public, cached API                                                 */
/* ------------------------------------------------------------------ */

export const getArticles = (locale: "de" | "en") =>
  unstable_cache(() => loadAll(locale), [`articles-${locale}`], {
    revalidate: 900,
    tags: ["articles", `articles-${locale}`],
  })();

export async function getArticleById(
  locale: "de" | "en",
  id: string,
): Promise<{ article: Article; related: Article[] } | null> {
  const all = await getArticles(locale);
  const article = all.find((a) => a.id === id);
  if (!article) return null;
  const related = all
    .filter((a) => a.id !== id && a.category === article.category)
    .slice(0, 4);
  return { article, related };
}

export function pickFeatured(articles: Article[]): {
  hero: Article | undefined;
  bento: Article[];
  rest: Article[];
} {
  const withImage = articles.filter((a) => a.image);
  const hero = withImage[0] ?? articles[0];
  const usedIds = new Set([hero?.id]);
  const bento = withImage.filter((a) => !usedIds.has(a.id)).slice(0, 4);
  bento.forEach((a) => usedIds.add(a.id));
  const rest = articles.filter((a) => !usedIds.has(a.id));
  return { hero, bento, rest };
}

export function trending(articles: Article[], limit = 6): Article[] {
  // Lightweight "trending" heuristic: most recent across diverse categories.
  const byCat = new Map<string, Article>();
  for (const a of articles) {
    if (!byCat.has(a.category)) byCat.set(a.category, a);
  }
  return [...byCat.values()].slice(0, limit);
}
