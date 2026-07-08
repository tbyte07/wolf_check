import { getSupabase } from "@/lib/supabase";
import type { FinalResult, SortKey, Status } from "@/lib/types";
import { Wordmark } from "@/components/Wordmark";
import { FilterTabs } from "@/components/FilterTabs";
import { SortToggle } from "@/components/SortToggle";
import { InboxGrid } from "@/components/InboxGrid";
import { SwipeDeck } from "@/components/SwipeDeck";

export const dynamic = "force-dynamic";

const VALID_STATUS: Status[] = ["open", "accepted", "declined", "decrease"];
const VALID_SORT: SortKey[] = ["views", "likes", "gefunden_am"];

function parseStatus(v?: string): Status {
  return VALID_STATUS.includes(v as Status) ? (v as Status) : "open";
}
function parseSort(v?: string): SortKey {
  return VALID_SORT.includes(v as SortKey) ? (v as SortKey) : "views";
}

export default async function Page({
  searchParams,
}: {
  searchParams: { status?: string; sort?: string };
}) {
  const status = parseStatus(searchParams.status);
  const sort = parseSort(searchParams.sort);

  const supabase = getSupabase();

  // Rows for the active status filter, sorted by the chosen key (desc).
  const { data, error } = await supabase
    .from("final_results")
    .select("*")
    .eq("status", status)
    .order(sort, { ascending: false });

  // Per-status counts for the filter tabs.
  const { data: allStatuses } = await supabase
    .from("final_results")
    .select("status");

  const counts: Partial<Record<Status, number>> = {};
  for (const row of allStatuses ?? []) {
    const s = (row as { status: Status }).status;
    counts[s] = (counts[s] ?? 0) + 1;
  }

  const items = (data ?? []) as FinalResult[];

  return (
    <>
      {/* Sticky app header — stays pinned to the top while scrolling. */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(247, 247, 250, 0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "14px clamp(16px, 4vw, 32px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Wordmark size={26} />
          <p
            style={{
              margin: 0,
              color: "var(--ink-500)",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Virale Falschaussagen prüfen &amp; richtigstellen
          </p>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "clamp(16px, 4vw, 28px) clamp(16px, 4vw, 32px) 64px",
        }}
      >
        {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <FilterTabs active={status} counts={counts} />
        <SortToggle active={sort} />
      </div>

      {error ? (
        <ErrorState message={error.message} />
      ) : status === "open" ? (
        // Main screen: the Tinder-style swipe deck of open videos.
        <SwipeDeck items={items} />
      ) : items.length === 0 ? (
        <EmptyState status={status} />
      ) : (
        // Decided tabs: a review grid of past decisions.
        <InboxGrid items={items} />
      )}
      </main>
    </>
  );
}

function EmptyState({ status }: { status: Status }) {
  const msg =
    status === "open"
      ? "Keine offenen Vorschläge. Neue virale Videos landen automatisch hier."
      : "Hier ist noch nichts.";
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 24px",
        color: "var(--ink-500)",
      }}
    >
      <div
        className="disp"
        style={{ fontSize: 32, color: "var(--ink-900)", marginBottom: 10 }}
      >
        Alles gecheckt!
      </div>
      <p style={{ margin: 0, maxWidth: "32ch", marginInline: "auto" }}>{msg}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "24px",
        borderRadius: "var(--radius-lg)",
        background: "var(--reject-50)",
        color: "#C41118",
        border: "1px solid var(--reject-500)",
      }}
    >
      <strong>Daten konnten nicht geladen werden.</strong>
      <div style={{ marginTop: 6, fontSize: 13, fontFamily: "monospace" }}>
        {message}
      </div>
    </div>
  );
}
