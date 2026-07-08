import { getSupabase } from "@/lib/supabase";
import type { FinalResult, Status } from "@/lib/types";
import { AppFrame } from "@/components/AppFrame";
import { DashboardScreen } from "@/components/DashboardScreen";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = getSupabase();

  // One lightweight query for the KPI counts + reach, one for the accepted
  // list shown below.
  const [{ data: all }, { data: accepted, error }] = await Promise.all([
    supabase.from("final_results").select("status, views"),
    supabase
      .from("final_results")
      .select("*")
      .eq("status", "accepted")
      .order("views", { ascending: false }),
  ]);

  const counts: Record<Status, number> = {
    open: 0,
    accepted: 0,
    declined: 0,
    decrease: 0,
  };
  let reach = 0;
  for (const row of (all ?? []) as { status: Status; views: number }[]) {
    if (counts[row.status] !== undefined) counts[row.status] += 1;
    if (row.status === "accepted") reach += row.views ?? 0;
  }

  return (
    <AppFrame>
      <DashboardScreen
        counts={counts}
        reach={reach}
        accepted={(accepted ?? []) as FinalResult[]}
        error={error?.message ?? null}
      />
    </AppFrame>
  );
}
