import type { ReactNode } from "react";

// Fixed, screen-sized app shell (the "phone frame" from the Claude Design
// mockup). Fills the viewport exactly and never scrolls at the page level —
// each screen manages its own internal layout/scroll inside the frame.
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(0px, 3vw, 40px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          height: "min(920px, 100%)",
          background: "var(--bg-app)",
          borderRadius: "clamp(0px, 3vw, 30px)",
          boxShadow: "0 40px 90px rgba(22,22,28,0.18)",
          border: "1px solid var(--border-subtle)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}
