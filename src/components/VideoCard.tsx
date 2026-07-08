"use client";

import { Eye, Heart, Play } from "lucide-react";
import type { FinalResult } from "@/lib/types";
import { formatCount, relativeDate } from "@/lib/format";
import { Badge } from "./Badge";
import { PlatformBadge } from "./PlatformBadge";

// Inbox card: big lazy thumbnail with a scrim, the flagged false claim
// (hypothese) as the hero line, title, platform, views/likes and found-date.
// Clicking selects the card, which opens the detail modal.
export function VideoCard({
  item,
  onOpen,
}: {
  item: FinalResult;
  onOpen: (item: FinalResult) => void;
}) {
  const thumb = `/api/thumb?platform=${item.plattform}&link=${encodeURIComponent(
    item.link
  )}`;

  return (
    <button
      onClick={() => onOpen(item)}
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        padding: 0,
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
        background: "var(--bg-surface)",
        boxShadow: "var(--shadow-sm)",
        cursor: "pointer",
        overflow: "hidden",
        transition: "transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
        WebkitTapHighlightColor: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      {/* Thumbnail with scrim + claim overlay */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4",
          background: "var(--ink-900)",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt=""
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* top row: platform + play cue */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <PlatformBadge platform={item.plattform} onDark />
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play size={16} color="#fff" style={{ marginLeft: 2 }} />
          </span>
        </div>
        {/* bottom scrim + claim */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "56px 14px 14px",
            background:
              "linear-gradient(to top, rgba(8,8,12,0.94), rgba(8,8,12,0.68) 45%, transparent)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Badge tone="reject" style={{ alignSelf: "flex-start" }}>
            Falschaussage
          </Badge>
          <span
            className="disp"
            style={{
              fontSize: 20,
              color: "#fff",
              lineHeight: 1.08,
              textTransform: "none",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            „{item.hypothese}"
          </span>
        </div>
      </div>

      {/* Meta footer */}
      <div
        style={{
          padding: "12px 14px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: "var(--ink-900)",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.titel}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "var(--ink-500)",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Eye size={14} /> {formatCount(item.views)}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Heart size={14} /> {formatCount(item.likes)}
          </span>
          <span style={{ marginLeft: "auto", color: "var(--ink-400)" }}>
            {relativeDate(item.gefunden_am)}
          </span>
        </div>
      </div>
    </button>
  );
}
