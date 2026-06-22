import { NextResponse } from "next/server";
import {
  buildSummaryInstruction,
  lengthTokens,
  prefsKey,
  type Tone,
  type Length,
  type Level,
} from "@/lib/prefs";

export const runtime = "nodejs";
export const maxDuration = 30;

// Warm-instance cache so we don't re-summarize the same article+prefs repeatedly.
const cache = new Map<string, string>();

interface Body {
  id: string;
  title: string;
  summary: string;
  link?: string;
  locale: "de" | "en";
  prefs?: { tone: Tone; length: Length; level: Level };
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const { id, title, summary, locale } = body;
  const prefs = {
    tone: body.prefs?.tone ?? "neutral",
    length: body.prefs?.length ?? "medium",
    level: body.prefs?.level ?? "beginner",
  };
  const fallback = summary?.slice(0, 400) || "";

  const apiKey = process.env.LLM_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL || "https://api.moonshot.ai/v1";
  const model = process.env.LLM_MODEL || "moonshot-v1-8k";

  // No key configured → graceful fallback to the original snippet.
  if (!apiKey) {
    return NextResponse.json({ summary: fallback, ai: false });
  }

  const cacheKey = `${locale}:${id}:${prefsKey(prefs)}`;
  if (cache.has(cacheKey)) {
    return NextResponse.json({ summary: cache.get(cacheKey), ai: true });
  }

  const lang = locale === "de" ? "German" : "English";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const payload: Record<string, unknown> = {
      model,
      temperature: 0.35,
      max_tokens: lengthTokens(prefs.length),
      messages: [
        { role: "system", content: buildSummaryInstruction(prefs, lang) },
        { role: "user", content: `Headline: ${title}\n\nExcerpt: ${summary}` },
      ],
    };

    // Optional: some reasoning models accept a flag to skip thinking.
    // Off by default — several Nemotron variants behave WORSE with it
    // (return null content). Enable only if your model needs it.
    if (process.env.LLM_DISABLE_THINKING === "true") {
      payload.chat_template_kwargs = { enable_thinking: false };
    }

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ summary: fallback, ai: false });
    }
    const data = await res.json();
    const raw: string = data?.choices?.[0]?.message?.content?.trim() || "";
    // Clean up: strip reasoning blocks, markdown, and any leading preamble.
    let out = raw
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/\*\*/g, "")
      .replace(/^#+\s*/gm, "")
      .trim();
    out = out
      .replace(/^\s*(hier ist|here is|here'?s|tl;?dr|zusammenfassung)[^\n:]*:\s*/i, "")
      .replace(/^["“„]|["”]$/g, "")
      .trim();
    if (!out) out = fallback;
    cache.set(cacheKey, out);
    return NextResponse.json({ summary: out, ai: out !== fallback });
  } catch {
    return NextResponse.json({ summary: fallback, ai: false });
  }
}
