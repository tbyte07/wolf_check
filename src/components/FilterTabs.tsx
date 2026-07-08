"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Status } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

const ORDER: Status[] = ["open", "accepted", "declined", "decrease"];

// Status filter — keeps past decisions reviewable, not just the open queue.
// Drives the ?status= URL param so the server component re-queries.
export function FilterTabs({
  active,
  counts,
}: {
  active: Status;
  counts?: Partial<Record<Status, number>>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function select(status: Status) {
    const next = new URLSearchParams(params.toString());
    next.set("status", status);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        paddingBottom: 2,
      }}
    >
      {ORDER.map((s) => {
        const selected = s === active;
        const count = counts?.[s];
        return (
          <button
            key={s}
            onClick={() => select(s)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontWeight: 600,
              fontSize: 14,
              padding: "8px 14px",
              borderRadius: "var(--radius-pill)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: selected ? "var(--ink-900)" : "var(--paper-0)",
              color: selected ? "var(--paper-0)" : "var(--ink-700)",
              border: `1.5px solid ${
                selected ? "var(--ink-900)" : "var(--border-strong)"
              }`,
              transition: "all var(--dur-fast) var(--ease-out)",
            }}
          >
            {STATUS_LABELS[s]}
            {typeof count === "number" && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: selected ? "rgba(255,255,255,0.7)" : "var(--ink-400)",
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
