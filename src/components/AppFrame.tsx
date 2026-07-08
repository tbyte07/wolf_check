import type { ReactNode } from "react";

// Fixed, screen-sized app shell. Centered "phone" frame on desktop, full
// bleed on mobile (see .app-frame-* in globals.css). The page never scrolls
// at the top level — each screen manages its own internal layout/scroll.
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="app-frame-outer">
      <div className="app-frame-inner">{children}</div>
    </div>
  );
}
