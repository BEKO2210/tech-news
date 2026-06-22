import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // Protect with CRON_SECRET when set (Vercel Cron sends it as a Bearer token).
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  revalidateTag("articles", "max");

  return NextResponse.json({
    ok: true,
    revalidated: "articles",
    at: new Date().toISOString(),
  });
}
