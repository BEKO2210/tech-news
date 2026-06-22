import type { CategoryKey } from "./types";

export type Tone = "casual" | "neutral" | "technical";
export type Length = "short" | "medium" | "long";
export type Level = "beginner" | "pro";

export interface Prefs {
  topics: CategoryKey[];
  tone: Tone;
  length: Length;
  level: Level;
  onboarded: boolean;
}

export const DEFAULT_PREFS: Prefs = {
  topics: [],
  tone: "neutral",
  length: "medium",
  level: "beginner",
  onboarded: false,
};

export const STORAGE_KEY = "flux:prefs";

/** Build the LLM system instruction from the user's preferences. */
export function buildSummaryInstruction(
  p: { tone: Tone; length: Length; level: Level },
  lang: "German" | "English",
): string {
  const tone: Record<Tone, string> = {
    casual: "Use a relaxed, friendly, accessible tone.",
    neutral: "Use a neutral, factual, journalistic tone.",
    technical: "Use a precise, technical tone with correct terminology.",
  };
  const length: Record<Length, string> = {
    short: "Write exactly ONE punchy sentence.",
    medium: "Write 2-3 tight sentences.",
    long: "Write one compact paragraph of 4-6 sentences.",
  };
  const level: Record<Level, string> = {
    beginner: "Briefly explain any jargon so a newcomer understands.",
    pro: "Assume an expert reader; be compact and skip the basics.",
  };
  return [
    `You are a sharp tech-news editor for FLUX. Summarize the article in ${lang}.`,
    tone[p.tone],
    length[p.length],
    level[p.level],
    "Stay strictly grounded in the provided text — invent nothing. No preamble, no markdown, no reasoning. Output only the summary.",
  ].join(" ");
}

export function lengthTokens(length: Length): number {
  return length === "short" ? 120 : length === "long" ? 640 : 320;
}

/** Stable hash of the prefs that affect generated text (for caching). */
export function prefsKey(p: { tone: Tone; length: Length; level: Level }): string {
  return `${p.tone}.${p.length}.${p.level}`;
}
