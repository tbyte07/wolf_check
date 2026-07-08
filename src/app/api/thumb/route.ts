import { NextRequest, NextResponse } from "next/server";
import type { Platform } from "@/lib/types";
import { directThumbnail, oembedThumbnail } from "@/lib/platform";

// Thumbnail proxy. A card's <img> points here with the post link + platform;
// we resolve the real static image and 302 to it. YouTube is derived straight
// from the URL, TikTok goes through oEmbed, Instagram falls back to a bundled
// placeholder. Keeping this behind loading="lazy" means thumbnails only
// resolve as the browser scrolls them into view — no embeds are loaded here.
export const runtime = "nodejs";

const PLACEHOLDER = "/thumb-placeholder.svg";

function isPlatform(v: string | null): v is Platform {
  return v === "youtube" || v === "tiktok" || v === "instagram";
}

export async function GET(req: NextRequest) {
  const link = req.nextUrl.searchParams.get("link");
  const platform = req.nextUrl.searchParams.get("platform");

  if (!link || !isPlatform(platform)) {
    return NextResponse.redirect(new URL(PLACEHOLDER, req.url));
  }

  const direct = directThumbnail(platform, link);
  const url = direct ?? (await oembedThumbnail(platform, link));

  const target = url ?? new URL(PLACEHOLDER, req.url).toString();
  const res = NextResponse.redirect(target);
  // Cache the redirect so repeated card renders don't re-hit oEmbed.
  res.headers.set(
    "Cache-Control",
    "public, max-age=3600, stale-while-revalidate=86400"
  );
  return res;
}
