"use client";

import { useEffect, useRef } from "react";
import { tiktokId } from "@/lib/platform";

// TikTok: official blockquote embed. The embed.js script is injected only
// when this component mounts (i.e. when a TikTok card is opened). Re-adding
// the script on each mount makes TikTok re-scan and render the blockquote.
export function TikTokEmbed({ link }: { link: string }) {
  const ref = useRef<HTMLQuoteElement>(null);
  const id = tiktokId(link);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [link]);

  return (
    <blockquote
      ref={ref}
      className="tiktok-embed"
      cite={link}
      data-video-id={id ?? undefined}
      style={{
        maxWidth: "100%",
        minWidth: 0,
        margin: 0,
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
      }}
    >
      <section>
        <a href={link} target="_blank" rel="noreferrer">
          Auf TikTok ansehen ↗
        </a>
      </section>
    </blockquote>
  );
}
