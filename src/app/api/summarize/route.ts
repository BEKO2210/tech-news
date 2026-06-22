import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Warm-instance cache so we don't re-summarize the same article repeatedly.
const cache = new Map<string, string>();

interface Body {
  id: string;
  title: string;
  summary: string;
  link?: string;
  locale: "de" | "en";
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const { id, title, summary, locale } = body;
  const fallback = summary?.slice(0, 400) || "";

  const apiKey = process.env.LLM_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL || "https://api.moonshot.ai/v1";
  const model = process.env.LLM_MODEL || "moonshot-v1-8k";

  // No key configured → graceful fallback to the original snippet.
  if (!apiKey) {
    return NextResponse.json({ summary: fallback, ai: false });
  }

  const cacheKey = `${locale}:${id}`;
  if (cache.has(cacheKey)) {
    return NextResponse.json({ summary: cache.get(cacheKey), ai: true });
  }

  const lang = locale === "de" ? "German" : "English";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const payload: Record<string, unknown> = {
      model,
      temperature: 0.3,
      max_tokens: 512,
      messages: [
        {
          role: "system",
          content: `You are a sharp tech-news editor for FLUX. Write a punchy TL;DR of 2-3 sentences in ${lang}. Be factual, no hype, no preamble, no markdown, no reasoning. Output only the summary.`,
        },
        {
          role: "user",
          content: `Headline: ${title}\n\nExcerpt: ${summary}`,
        },
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
    // Strip any leaked <think>…</think> reasoning blocks.
    const out = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim() || fallback;
    cache.set(cacheKey, out);
    return NextResponse.json({ summary: out, ai: Boolean(out && out !== fallback) || raw.length > 0 });
  } catch {
    return NextResponse.json({ summary: fallback, ai: false });
  }
}
