"use client";

import { useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Play,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import type { FinalResult, Status } from "@/lib/types";
import { PLATFORM_LABELS } from "@/lib/types";
import { formatCount } from "@/lib/format";
import { PlatformBadge } from "./PlatformBadge";
import { DetailModal } from "./DetailModal";

// Dashboard: KPI stat cards + the list of accepted videos (waiting to be
// turned into a debunk). Lives inside the fixed app frame; the body scrolls
// internally while the header stays put. Tapping a video opens its embed.
export function DashboardScreen({
  counts,
  reach,
  accepted,
  error,
}: {
  counts: Record<Status, number>;
  reach: number;
  accepted: FinalResult[];
  error: string | null;
}) {
  const [selected, setSelected] = useState<FinalResult | null>(null);

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "18px 18px 14px",
          flexShrink: 0,
        }}
      >
        <Link
          href="/"
          aria-label="Zurück"
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-pill)",
            border: "2px solid var(--border-subtle)",
            background: "var(--paper-0)",
            color: "var(--ink-700)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={20} />
        </Link>
        <span className="disp" style={{ fontSize: 25, color: "var(--ink-900)" }}>
          Dashboard
        </span>
      </div>

      {/* Scrollable body */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "0 18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <StatCard
            label="Angenommen"
            value={String(counts.accepted)}
            tone="accept"
            icon={<Check size={18} />}
          />
          <StatCard
            label="Abgelehnt"
            value={String(counts.declined)}
            tone="reject"
            icon={<X size={18} />}
          />
          <StatCard
            label="Neue Videos"
            value={String(counts.open)}
            tone="rose"
            icon={<Sparkles size={18} />}
          />
          <StatCard
            label="Reichweite geprüft"
            value={formatCount(reach)}
            tone="sky"
            icon={<TrendingUp size={18} />}
          />
        </div>

        {/* Accepted list */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <span className="disp" style={{ fontSize: 20, color: "var(--ink-900)" }}>
            Angenommen
          </span>
          <span
            style={{ fontSize: 13, fontWeight: 600, color: "var(--rose-500)" }}
          >
            {accepted.length} Videos
          </span>
        </div>

        {error ? (
          <div
            style={{
              fontSize: 13,
              color: "#C41118",
              background: "var(--reject-50)",
              border: "1px solid var(--reject-500)",
              padding: "10px 12px",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {error}
          </div>
        ) : accepted.length === 0 ? (
          <p
            style={{
              margin: 0,
              color: "var(--ink-500)",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            Noch nichts angenommen. Wische auf der Startseite Videos nach rechts,
            um sie hier zu sammeln.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {accepted.map((v) => (
              <AcceptedRow key={v.link} item={v} onOpen={() => setSelected(v)} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

const TONES: Record<string, string> = {
  accept: "var(--accept-500)",
  reject: "var(--reject-500)",
  rose: "var(--rose-500)",
  sky: "var(--sky-500)",
};

function StatCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: keyof typeof TONES;
  icon: ReactNode;
}) {
  const color = TONES[tone];
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-sm)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ink-500)",
          }}
        >
          {label}
        </span>
        <span style={{ color, display: "inline-flex" }}>{icon}</span>
      </div>
      <span
        className="disp"
        style={{ fontSize: 36, color, textTransform: "none" }}
      >
        {value}
      </span>
    </div>
  );
}

function AcceptedRow({
  item,
  onOpen,
}: {
  item: FinalResult;
  onOpen: () => void;
}) {
  const thumb = `/api/thumb?platform=${item.plattform}&link=${encodeURIComponent(
    item.link
  )}`;
  return (
    <button
      onClick={onOpen}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        textAlign: "left",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-sm)",
        padding: 12,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 56,
          height: 56,
          borderRadius: 12,
          overflow: "hidden",
          background: "var(--ink-900)",
          flexShrink: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt=""
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <Play size={18} />
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: "var(--ink-900)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          „{item.hypothese}"
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 6,
            alignItems: "center",
            color: "var(--ink-400)",
            fontSize: 12,
          }}
        >
          <PlatformBadge platform={item.plattform} />
          <span>{formatCount(item.views)} Views</span>
        </div>
      </div>
      <ChevronRight
        size={20}
        color="var(--ink-400)"
        style={{ flexShrink: 0 }}
      />
    </button>
  );
}
