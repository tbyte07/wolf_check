import { getSupabase } from "@/lib/supabase";
import type { FinalResult } from "@/lib/types";
import { AppFrame } from "@/components/AppFrame";
import { DeckScreen } from "@/components/DeckScreen";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = getSupabase();

  // The deck shows only the open videos, most-viral first.
  const { data, error } = await supabase
    .from("final_results")
    .select("*")
    .eq("status", "open")
    .order("views", { ascending: false });

  const items = (data ?? []) as FinalResult[];

  return (
    <AppFrame>
      <DeckScreen items={items} error={error?.message ?? null} />
    </AppFrame>
  );
}
