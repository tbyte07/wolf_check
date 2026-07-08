"use client";

import { useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Check, PartyPopper, RotateCcw, TrendingDown, X } from "lucide-react";
import type { FinalResult, Platform, Status } from "@/lib/types";
import { PLATFORM_COLORS, PLATFORM_LABELS } from "@/lib/types";
import { updateStatus } from "@/app/actions";
import { SwipeCard, type Verdict } from "./SwipeCard";
import { DetailModal } from "./DetailModal";

type Filter = Platform | "Alle";
const FILTERS: Filter[] = ["Alle", "youtube", "tiktok", "instagram"];
const FILTER_LABEL = (f: Filter) => (f === "Alle" ? "Alle" : PLATFORM_LABELS[f]);

const VERDICT_STATUS: Record<Exclude<Verdict, null>, Status> = {
  accept: "accepted",
  reject: "declined",
  decrease: "decrease",
};

// The main screen: a Tinder-style deck of the open videos. Swipe right to
// accept, left to decline, or use the buttons below (decline / decrease /
// accept, plus undo). Each decision writes the new status to Supabase.
// `persist` defaults to the real server action and is only overridden in tests.
export function SwipeDeck({
  items,
  persist = updateStatus,
}: {
  items: FinalResult[];
  persist?: (
    link: string,
    status: Status
  ) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [filter, setFilter] = useState<Filter>("Alle");
  const [decided, setDecided] = useState<{ link: string; status: Status }[]>([]);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoItem, setVideoItem] = useState<FinalResult | null>(null);

  const startX = useRef<number | null>(null);
  const dragRef = useRef(0);

  const decidedLinks = new Set(decided.map((d) => d.link));
  const deck = items.filter(
    (i) =>
      !decidedLinks.has(i.link) && (filter === "Alle" || i.plattform === filter)
  );
  const cur = deck[0];

  function commit(dir: Exclude<Verdict, null>) {
    if (!cur || busy) return;
    const link = cur.link;
    const status = VERDICT_STATUS[dir];
    setBusy(true);
    setVerdict(dir);
    setError(null);
    const pending = persist(link, status);
    window.setTimeout(async () => {
      const res = await pending;
      if (res.ok) {
        setDecided((d) => [...d, { link, status }]);
      } else {
        setError(res.error || "Status konnte nicht gespeichert werden.");
      }
      setVerdict(null);
      setDrag(0);
      dragRef.current = 0;
      setBusy(false);
    }, 340);
  }

  async function undo() {
    if (!decided.length || busy) return;
    const last = decided[decided.length - 1];
    setBusy(true);
    setError(null);
    setDecided((d) => d.slice(0, -1)); // optimistic: bring the card back
    const res = await persist(last.link, "open");
    if (!res.ok) {
      setError(res.error || "Rückgängig machen fehlgeschlagen.");
      setDecided((d) => [...d, last]);
    }
    setBusy(false);
  }

  // Pointer drag (mouse + touch via Pointer Events).
  function onDown(e: React.PointerEvent) {
    if (busy || !cur) return;
    startX.current = e.clientX;
    dragRef.current = 0;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    dragRef.current = dx;
    setDrag(dx);
  }
  function onUp() {
    if (startX.current == null) return;
    const dx = dragRef.current;
    startX.current = null;
    setDragging(false);
    if (dx > 110) commit("accept");
    else if (dx < -110) commit("reject");
    else {
      setDrag(0);
      dragRef.current = 0;
    }
  }

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      {/* Platform filter chips */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {FILTERS.map((f) => {
          const selected = f === filter;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontWeight: 600,
                fontSize: 14,
                padding: "8px 14px",
                borderRadius: "var(--radius-pill)",
                cursor: "pointer",
                background: selected ? "var(--ink-900)" : "var(--paper-0)",
                color: selected ? "var(--paper-0)" : "var(--ink-700)",
                border: `1.5px solid ${
                  selected ? "var(--ink-900)" : "var(--border-strong)"
                }`,
                transition: "all var(--dur-fast) var(--ease-out)",
              }}
            >
              {f !== "Alle" && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: PLATFORM_COLORS[f],
                  }}
                />
              )}
              {FILTER_LABEL(f)}
            </button>
          );
        })}
      </div>

      {error && (
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            fontSize: 13,
            color: "#C41118",
            background: "var(--reject-50)",
            border: "1px solid var(--reject-500)",
            padding: "8px 12px",
            borderRadius: "var(--radius-sm)",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {/* Card stage — fills remaining height; card keeps a portrait ratio */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          style={{
            position: "relative",
            height: "100%",
            aspectRatio: "3 / 4.2",
            maxWidth: "100%",
            maxHeight: "100%",
            touchAction: "pan-y",
            cursor: cur ? "grab" : "default",
          }}
        >
          {cur ? (
            <>
              {deck[2] && (
              <div
                key="b2"
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: "scale(0.9) translateY(20px)",
                  borderRadius: "var(--radius-xl)",
                  background: "var(--paper-0)",
                  boxShadow: "var(--shadow-sm)",
                  border: "1px solid var(--border-subtle)",
                }}
              />
            )}
            {deck[1] && (
              <div
                key="b1"
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: "scale(0.95) translateY(10px)",
                  borderRadius: "var(--radius-xl)",
                  background: "var(--paper-0)",
                  boxShadow: "var(--shadow-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              />
            )}
            <SwipeCard
              key={cur.link}
              item={cur}
              drag={drag}
              verdict={verdict}
              dragging={dragging}
              onPlay={() => setVideoItem(cur)}
            />
          </>
          ) : (
            <EmptyDeck />
          )}
        </div>
      </div>

      {/* Action bar */}
      {cur && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexShrink: 0,
          }}
        >
          <RoundButton
            variant="undo"
            size="md"
            label="Zurück"
            onClick={undo}
            disabled={!decided.length || busy}
          >
            <RotateCcw size={22} />
          </RoundButton>
          <RoundButton
            variant="reject"
            size="xl"
            label="Ablehnen"
            onClick={() => commit("reject")}
            disabled={busy}
          >
            <X size={30} />
          </RoundButton>
          <RoundButton
            variant="decrease"
            size="md"
            label="Zu oft verwendet"
            onClick={() => commit("decrease")}
            disabled={busy}
          >
            <TrendingDown size={22} />
          </RoundButton>
          <RoundButton
            variant="accept"
            size="xl"
            label="Annehmen"
            onClick={() => commit("accept")}
            disabled={busy}
          >
            <Check size={30} />
          </RoundButton>
        </div>
      )}

      {cur && (
        <span
          style={{
            fontSize: 13,
            color: "var(--ink-500)",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          {deck.length} offen{filter !== "Alle" ? ` · ${FILTER_LABEL(filter)}` : ""}
        </span>
      )}

      {/* Video preview (real embed, lazy) — no status buttons here. */}
      {videoItem && (
        <DetailModal
          item={videoItem}
          showActions={false}
          onClose={() => setVideoItem(null)}
        />
      )}
    </div>
  );
}

function EmptyDeck() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        textAlign: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: "50%",
          background: "var(--rose-50)",
          color: "var(--rose-500)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PartyPopper size={34} />
      </div>
      <span className="disp" style={{ fontSize: 30, color: "var(--ink-900)" }}>
        Alles gecheckt!
      </span>
      <span style={{ color: "var(--ink-500)", fontSize: 15, maxWidth: "28ch" }}>
        Keine offenen Videos mehr. Neue virale Clips landen automatisch hier.
      </span>
    </div>
  );
}

function RoundButton({
  children,
  variant,
  size,
  label,
  onClick,
  disabled,
}: {
  children: ReactNode;
  variant: "reject" | "accept" | "decrease" | "undo";
  size: "md" | "xl";
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  const dim = size === "xl" ? 68 : 56;
  const variants: Record<string, CSSProperties> = {
    reject: { color: "var(--reject-500)", border: "2px solid var(--reject-500)" },
    accept: { color: "var(--accept-500)", border: "2px solid var(--accept-500)" },
    decrease: { color: "var(--warn-500)", border: "2px solid var(--warn-500)" },
    undo: { color: "var(--ink-400)", border: "2px solid var(--border-strong)" },
  };
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      onPointerDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(0.9)";
      }}
      onPointerUp={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      style={{
        width: dim,
        height: dim,
        borderRadius: "var(--radius-pill)",
        background: "var(--paper-0)",
        boxShadow: "var(--shadow-md)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "transform var(--dur-fast) var(--ease-bounce)",
        ...variants[variant],
      }}
    >
      {children}
    </button>
  );
}
