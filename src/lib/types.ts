export type CategoryKey =
  | "ai"
  | "hardware"
  | "software"
  | "space"
  | "science"
  | "gaming"
  | "crypto"
  | "security"
  | "business"
  | "mobile";

export const CATEGORY_KEYS: CategoryKey[] = [
  "ai",
  "hardware",
  "software",
  "space",
  "science",
  "gaming",
  "crypto",
  "security",
  "business",
  "mobile",
];

/** Accent color per category — used for tags, glows, gradients. */
export const CATEGORY_ACCENT: Record<CategoryKey, string> = {
  ai: "#c6f03c", // signature lime for the flagship category
  hardware: "#22d3ee", // cyan
  software: "#4da3ff", // azure
  space: "#5b8def", // blue
  science: "#7cffb2", // mint
  gaming: "#ff4d8d", // pink
  crypto: "#f7b733", // gold
  security: "#ff5c48", // coral-red
  business: "#2bd980", // emerald
  mobile: "#38bdf8", // sky
};

export interface Article {
  id: string;
  title: string;
  link: string;
  source: string;
  sourceId: string;
  author?: string;
  category: CategoryKey;
  summary: string;
  image?: string;
  publishedAt: string;
  locale: "de" | "en";
  readingTime: number;
}
