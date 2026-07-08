"use client";

import { Eye, Heart, Play } from "lucide-react";
import type { FinalResult } from "@/lib/types";
import { formatCount } from "@/lib/format";
import { Badge } from "./Badge";
import { PlatformBadge } from "./PlatformBadge";

export type Verdict = "accept" | "reject" | "decrease" | null;

// The WolfCheck swipe card: a big full-bleed video thumbnail with a bottom
// scrim, the flagged false claim (hypothese), title, platform and reach/likes.
// `drag` is the live horizontal offset while dragging; `verdict` triggers the
// throw-out animation once a decision is committed.
export function SwipeCard({
  item,
  drag,
  verdict,
  dragging,
  onPlay,
}: {
  item: FinalResult;
  drag: number;
  verdict: Verdict;
  dragging: boolean;
  onPlay: () => void;
}) {
  const thumb = `/api/thumb?platform=${item.plattform}&link=${encodeURIComponent(
    item.link
  )}`;

  const showAccept = verdict === "accept" || drag > 40;
  const showReject = verdict === "reject" || drag < -40;

  let transform: string;
  if (verdict === "accept") transform = "translateX(560px) rotate(18deg)";
  else if (verdict === "reject") transform = "translateX(-560px) rotate(-18deg)";
  else if (verdict === "decrease") transform = "translateY(700px)";
  else transform = `translateX(${drag}px) rotate(${drag * 0.04}deg)`;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        background: "var(--ink-900)",
        boxShadow: "var(--shadow-card)",
        transform,
        opacity: verdict ? 0 : 1,
        transition: verdict
          ? "transform .35s var(--ease-out), opacity .35s"
          : dragging
          ? "transform .04s"
          : "transform .25s var(--ease-out)",
        userSelect: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumb}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />

      {/* Play affordance → opens the real embed */}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
        aria-label="Video ansehen"
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 66,
          height: 66,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(4px)",
          border: "2px solid rgba(255,255,255,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        <Play size={26} style={{ marginLeft: 3 }} />
      </button>

      {/* Top row: platform + views */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          right: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <PlatformBadge platform={item.plattform} onDark />
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 10px",
            borderRadius: "var(--radius-pill)",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(6px)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          <Eye size={13} /> {formatCount(item.views)}
        </span>
      </div>

      {/* Verdict stamps */}
      {showAccept && (
        <div
          className="disp"
          style={{
            position: "absolute",
            top: 26,
            right: 20,
            transform: "rotate(12deg)",
            border: "4px solid var(--accept-500)",
            color: "var(--accept-500)",
            padding: "4px 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.92)",
            fontSize: 28,
          }}
        >
          Annehmen
        </div>
      )}
      {showReject && (
        <div
          className="disp"
          style={{
            position: "absolute",
            top: 26,
            left: 20,
            transform: "rotate(-12deg)",
            border: "4px solid var(--reject-500)",
            color: "var(--reject-500)",
            padding: "4px 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.92)",
            fontSize: 28,
          }}
        >
          Ablehnen
        </div>
      )}

      {/* Bottom scrim + content */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "72px 18px 20px",
          background:
            "linear-gradient(to top, rgba(8,8,12,0.94), rgba(8,8,12,0.72) 45%, transparent)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Badge tone="reject" style={{ alignSelf: "flex-start" }}>
          Falschaussage
        </Badge>
        <span
          className="disp"
          style={{
            fontSize: 26,
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
        <span
          style={{
            fontWeight: 500,
            fontSize: 14,
            color: "rgba(255,255,255,0.75)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.titel}
        </span>
        <div
          style={{
            display: "flex",
            gap: 16,
            color: "rgba(255,255,255,0.8)",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Eye size={15} /> {formatCount(item.views)}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Heart size={15} /> {formatCount(item.likes)}
          </span>
        </div>
      </div>
    </div>
  );
}
