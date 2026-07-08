import { Check } from "lucide-react";

// The WolfCheck wordmark: "wolf" in ink + "check" in rose, both Barlow
// italic 800, preceded by a rose check badge. Pure text/icon construction —
// no imported logo (per the design guidelines; the More logo is never used).
export function Wordmark({ size = 26 }: { size?: number }) {
  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: size * 0.32 }}
    >
      <span
        style={{
          width: size * 1.08,
          height: size * 1.08,
          borderRadius: size * 0.3,
          background: "var(--rose-500)",
          boxShadow: "var(--glow-rose)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Check size={size * 0.62} color="#fff" strokeWidth={3.5} />
      </span>
      <span
        className="disp"
        style={{
          fontSize: size,
          color: "var(--ink-900)",
          textTransform: "none",
        }}
      >
        wolf<span style={{ color: "var(--rose-500)" }}>check</span>
      </span>
    </span>
  );
}
