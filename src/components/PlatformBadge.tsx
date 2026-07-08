import type { Platform } from "@/lib/types";
import { PLATFORM_COLORS, PLATFORM_LABELS } from "@/lib/types";

// Platform indicator: colored dot + text label. Deliberately does NOT
// reproduce any third-party logo (design guideline).
export function PlatformBadge({
  platform,
  onDark = false,
}: {
  platform: Platform;
  onDark?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: onDark ? "5px 10px" : 0,
        borderRadius: "var(--radius-pill)",
        background: onDark ? "rgba(0,0,0,0.55)" : "transparent",
        backdropFilter: onDark ? "blur(6px)" : undefined,
        color: onDark ? "#fff" : "var(--ink-700)",
        fontWeight: 700,
        fontSize: 12,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: PLATFORM_COLORS[platform],
          flexShrink: 0,
          boxShadow: onDark ? "0 0 0 1.5px rgba(255,255,255,0.5)" : "none",
        }}
      />
      {PLATFORM_LABELS[platform]}
    </span>
  );
}
