"use client";

import { youtubeId } from "@/lib/platform";

// YouTube: a plain iframe embed built from the video id. No external script.
export function YouTubeEmbed({ link }: { link: string }) {
  const id = youtubeId(link);
  if (!id) return <EmbedFallback link={link} />;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
      />
    </div>
  );
}

function EmbedFallback({ link }: { link: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "block",
        padding: 20,
        borderRadius: "var(--radius-md)",
        background: "var(--bg-sunken)",
        color: "var(--sky-600)",
        fontWeight: 600,
        textAlign: "center",
      }}
    >
      Video auf der Plattform öffnen ↗
    </a>
  );
}
