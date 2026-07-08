"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, Heart, TrendingDown, X } from "lucide-react";
import type { FinalResult, Status } from "@/lib/types";
import { formatCount, relativeDate } from "@/lib/format";
import { updateStatus } from "@/app/actions";
import { Badge } from "./Badge";
import { PlatformBadge } from "./PlatformBadge";
import { YouTubeEmbed } from "./embeds/YouTubeEmbed";
import { TikTokEmbed } from "./embeds/TikTokEmbed";
import { InstagramEmbed } from "./embeds/InstagramEmbed";

// Detail view. Lazy-loads the relevant platform embed (only when opened) and
// exposes the three review actions. After an action the row leaves the open
// queue (server action revalidates) and the modal closes.
export function DetailModal({
  item,
  onClose,
  showActions = true,
}: {
  item: FinalResult;
  onClose: () => void;
  showActions?: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  async function act(status: Status) {
    setPending(status);
    setError(null);
    const res = await updateStatus(item.link, status);
    if (res.ok) {
      router.refresh(); // re-fetch the current (review) list so the row updates
      onClose();
    } else {
      setError(res.error);
      setPending(null);
    }
  }

  return (
    <div
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(16,16,22,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(0px, 3vw, 32px)",
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 920,
          maxHeight: "94vh",
          overflowY: "auto",
          background: "var(--bg-surface)",
          borderRadius: "clamp(0px, 3vw, 28px)",
          boxShadow: "var(--shadow-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            position: "sticky",
            top: 0,
            background: "var(--bg-surface)",
            zIndex: 1,
          }}
        >
          <PlatformBadge platform={item.plattform} />
          <button
            onClick={onClose}
            aria-label="Schließen"
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-pill)",
              border: "2px solid var(--border-subtle)",
              background: "var(--paper-0)",
              color: "var(--ink-700)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body: embed + details, side by side on desktop */}
        <div
          style={{
            display: "grid",
            gap: "clamp(16px, 3vw, 28px)",
            gridTemplateColumns: "minmax(0, 1fr)",
            padding: "clamp(16px, 3vw, 28px)",
          }}
          className="detail-body"
        >
          <div style={{ minWidth: 0 }}>
            <PlatformEmbed item={item} />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}
          >
            <Badge tone="reject" style={{ alignSelf: "flex-start" }}>
              Falschaussage
            </Badge>
            <h2
              className="disp"
              style={{
                margin: 0,
                fontSize: "clamp(24px, 3.4vw, 34px)",
                color: "var(--ink-900)",
                lineHeight: 1.08,
                textTransform: "none",
              }}
            >
              „{item.hypothese}"
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                color: "var(--ink-700)",
                lineHeight: 1.5,
              }}
            >
              {item.titel}
            </p>

            {/* Meta row */}
            <div
              style={{
                display: "flex",
                gap: 18,
                color: "var(--ink-500)",
                fontSize: 14,
                fontWeight: 600,
                flexWrap: "wrap",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Eye size={16} /> {formatCount(item.views)} Views
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Heart size={16} /> {formatCount(item.likes)} Likes
              </span>
              <span style={{ color: "var(--ink-400)" }}>
                Gefunden {relativeDate(item.gefunden_am)}
              </span>
            </div>

            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--sky-600)",
                wordBreak: "break-all",
              }}
            >
              {item.link} ↗
            </a>

            {error && (
              <div
                style={{
                  fontSize: 13,
                  color: "#C41118",
                  background: "var(--reject-50)",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {error}
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 4,
                }}
              >
                <ActionButton
                  label="Annehmen"
                  icon={<Check size={18} />}
                  tone="accept"
                  loading={pending === "accepted"}
                  disabled={pending !== null}
                  onClick={() => act("accepted")}
                />
                <ActionButton
                  label="Ablehnen"
                  icon={<X size={18} />}
                  tone="reject"
                  loading={pending === "declined"}
                  disabled={pending !== null}
                  onClick={() => act("declined")}
                />
                <ActionButton
                  label="Zu oft verwendet"
                  icon={<TrendingDown size={18} />}
                  tone="warn"
                  loading={pending === "decrease"}
                  disabled={pending !== null}
                  onClick={() => act("decrease")}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-column layout on wider screens. */}
      <style>{`
        @media (min-width: 720px) {
          .detail-body { grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

function PlatformEmbed({ item }: { item: FinalResult }) {
  if (item.plattform === "youtube") return <YouTubeEmbed link={item.link} />;
  if (item.plattform === "tiktok") return <TikTokEmbed link={item.link} />;
  return <InstagramEmbed link={item.link} />;
}

function ActionButton({
  label,
  icon,
  tone,
  onClick,
  loading,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  tone: "accept" | "reject" | "warn";
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}) {
  const bg = {
    accept: "var(--accept-500)",
    reject: "var(--reject-500)",
    warn: "var(--warn-500)",
  }[tone];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        flex: "1 1 auto",
        minWidth: 130,
        fontWeight: 700,
        fontSize: 15,
        padding: "14px 18px",
        borderRadius: "var(--radius-pill)",
        border: "2px solid transparent",
        background: bg,
        color: "#fff",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled && !loading ? 0.5 : 1,
        transition: "transform var(--dur-fast) var(--ease-out)",
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(0.96)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {loading ? "…" : icon}
      {label}
    </button>
  );
}
