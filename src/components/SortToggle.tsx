"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import type { SortKey } from "@/lib/types";
import { SORT_LABELS } from "@/lib/types";

const ORDER: SortKey[] = ["views", "likes", "gefunden_am"];

// Sort control — toggles the ?sort= URL param (views / likes / newest).
export function SortToggle({ active }: { active: SortKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function select(sort: SortKey) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", sort);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <ArrowUpDown size={15} color="var(--ink-400)" />
      <div
        style={{
          display: "inline-flex",
          padding: 3,
          gap: 2,
          background: "var(--bg-sunken)",
          borderRadius: "var(--radius-pill)",
        }}
      >
        {ORDER.map((s) => {
          const selected = s === active;
          return (
            <button
              key={s}
              onClick={() => select(s)}
              style={{
                fontWeight: 600,
                fontSize: 13,
                padding: "6px 12px",
                borderRadius: "var(--radius-pill)",
                border: "none",
                cursor: "pointer",
                background: selected ? "var(--paper-0)" : "transparent",
                color: selected ? "var(--ink-900)" : "var(--ink-500)",
                boxShadow: selected ? "var(--shadow-sm)" : "none",
                transition: "all var(--dur-fast) var(--ease-out)",
              }}
            >
              {SORT_LABELS[s]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
