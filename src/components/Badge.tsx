import type { CSSProperties, ReactNode } from "react";

type Tone = "rose" | "sky" | "accept" | "reject" | "warn" | "neutral";

const PALETTE: Record<Tone, { solid: string; tint: string; ink: string }> = {
  rose: { solid: "var(--rose-500)", tint: "var(--rose-50)", ink: "var(--rose-600)" },
  sky: { solid: "var(--sky-500)", tint: "var(--sky-50)", ink: "var(--sky-700)" },
  accept: { solid: "var(--accept-500)", tint: "var(--accept-50)", ink: "#0C7C3D" },
  reject: { solid: "var(--reject-500)", tint: "var(--reject-50)", ink: "#C41118" },
  warn: { solid: "var(--warn-500)", tint: "var(--warn-50)", ink: "#B35F00" },
  neutral: { solid: "var(--ink-700)", tint: "var(--paper-100)", ink: "var(--ink-700)" },
};

// Compact status pill — verdict labels, "Falschaussage", reach tiers.
export function Badge({
  children,
  tone = "rose",
  soft = false,
  dot = false,
  uppercase = true,
  style = {},
}: {
  children: ReactNode;
  tone?: Tone;
  soft?: boolean;
  dot?: boolean;
  uppercase?: boolean;
  style?: CSSProperties;
}) {
  const p = PALETTE[tone];
  const bg = soft ? p.tint : p.solid;
  const fg = soft ? p.ink : "var(--paper-0)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontWeight: 700,
        fontSize: "var(--fs-caption)",
        letterSpacing: uppercase ? "0.06em" : 0,
        textTransform: uppercase ? "uppercase" : "none",
        padding: "4px 9px",
        borderRadius: "var(--radius-pill)",
        background: bg,
        color: fg,
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: soft ? p.solid : "currentColor",
          }}
        />
      )}
      {children}
    </span>
  );
}
