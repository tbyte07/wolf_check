"use client";

import { useState } from "react";
import type { FinalResult } from "@/lib/types";
import { VideoCard } from "./VideoCard";
import { DetailModal } from "./DetailModal";

// Client wrapper around the server-fetched rows. Holds the selected card so
// the detail modal can open over the grid without a route change.
export function InboxGrid({ items }: { items: FinalResult[] }) {
  const [selected, setSelected] = useState<FinalResult | null>(null);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "clamp(14px, 2vw, 22px)",
        }}
      >
        {items.map((item) => (
          <VideoCard key={item.link} item={item} onOpen={setSelected} />
        ))}
      </div>

      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
