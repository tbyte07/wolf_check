"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

// Instagram: official blockquote embed. embed.js is injected only when an
// Instagram card is opened; if the script is already present we just call
// window.instgrm.Embeds.process() to render the new blockquote.
export function InstagramEmbed({ link }: { link: string }) {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.instagram.com/embed.js"]'
    );
    if (existing && window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => window.instgrm?.Embeds.process();
    document.body.appendChild(script);
  }, [link]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={link}
      data-instgrm-version="14"
      style={{
        maxWidth: "100%",
        minWidth: 0,
        width: "100%",
        margin: 0,
        background: "#fff",
        borderRadius: "var(--radius-md)",
      }}
    >
      <a href={link} target="_blank" rel="noreferrer">
        Auf Instagram ansehen ↗
      </a>
    </blockquote>
  );
}
