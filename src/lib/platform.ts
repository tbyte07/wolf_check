import type { Platform } from "./types";

// ---------------------------------------------------------------------------
// URL parsing helpers. The `link` column holds the public post URL; we derive
// the platform-specific IDs needed for thumbnails and embeds from it.
// ---------------------------------------------------------------------------

/** Extract the YouTube video id from any common YouTube URL shape. */
export function youtubeId(link: string): string | null {
  try {
    const u = new URL(link);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return u.pathname.slice(1) || null;
    if (host.endsWith("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      // /shorts/<id>, /embed/<id>, /live/<id>
      const m = u.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?#]+)/);
      if (m) return m[1];
    }
    return null;
  } catch {
    return null;
  }
}

/** Extract the numeric TikTok video id (…/video/<id>) when present. */
export function tiktokId(link: string): string | null {
  const m = link.match(/\/video\/(\d+)/);
  return m ? m[1] : null;
}

/** Static thumbnail URL when it can be built without a network call. */
export function directThumbnail(
  platform: Platform,
  link: string
): string | null {
  if (platform === "youtube") {
    const id = youtubeId(link);
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
  }
  return null;
}

/**
 * Fetch a thumbnail URL via a platform oEmbed endpoint (server-side only).
 * Used for TikTok, where the thumbnail cannot be derived from the URL alone.
 * Returns null on any failure so the caller can fall back to a placeholder.
 */
export async function oembedThumbnail(
  platform: Platform,
  link: string
): Promise<string | null> {
  try {
    if (platform === "tiktok") {
      const res = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(link)}`,
        {
          // TikTok's oEmbed can reject requests without a browser-like UA.
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
          },
          next: { revalidate: 60 * 60 * 24 }, // cache 24h
        }
      );
      if (!res.ok) return null;
      const data = (await res.json()) as { thumbnail_url?: string };
      return data.thumbnail_url ?? null;
    }
    // Instagram oEmbed requires a Meta app token — not wired up yet.
    return null;
  } catch {
    return null;
  }
}
