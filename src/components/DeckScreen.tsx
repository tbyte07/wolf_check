"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import type { FinalResult } from "@/lib/types";
import { Wordmark } from "./Wordmark";
import { SwipeDeck } from "./SwipeDeck";

// The main screen inside the fixed app frame: a compact header (wordmark +
// dashboard link) above the swipe deck. Fills the frame, never scrolls.
export function DeckScreen({
  items,
  error,
}: {
  items: FinalResult[];
  error: string | null;
}) {
  const openCount = items.length;
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        padding: "18px 18px 16px",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Wordmark size={23} />
        <Link
          href="/dashboard"
          aria-label="Dashboard"
          style={{
            position: "relative",
            width: 48,
            height: 48,
            borderRadius: "var(--radius-pill)",
            background: "var(--rose-500)",
            color: "#fff",
            boxShadow: "var(--glow-rose)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <LayoutGrid size={20} />
          {openCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                minWidth: 20,
                height: 20,
                padding: "0 5px",
                borderRadius: 999,
                background: "var(--sky-500)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--bg-app)",
              }}
            >
              {openCount}
            </span>
          )}
        </Link>
      </div>

      {error ? (
        <div
          style={{
            margin: "auto",
            fontSize: 13,
            color: "#C41118",
            background: "var(--reject-50)",
            border: "1px solid var(--reject-500)",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            textAlign: "center",
          }}
        >
          <strong>Daten konnten nicht geladen werden.</strong>
          <div style={{ marginTop: 6, fontFamily: "monospace" }}>{error}</div>
        </div>
      ) : (
        <SwipeDeck items={items} />
      )}
    </div>
  );
}
